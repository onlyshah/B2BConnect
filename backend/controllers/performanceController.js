const mongoose = require('mongoose');
const Salesman = require('../models/Salesman');
const Visit = require('../models/Visit');
const Order = require('../models/Order');
const CollectionRecord = require('../models/CollectionRecord');
const Attendance = require('../models/Attendance');

const resolveCompanyId = (req) => req.user?.companyId || req.user?.tenantId || req.tenantId;

const getDateRange = (req) => {
  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

  if (startDate && Number.isNaN(startDate.getTime())) {
    throw new Error('Invalid startDate');
  }
  if (endDate && Number.isNaN(endDate.getTime())) {
    throw new Error('Invalid endDate');
  }

  if (!startDate && !endDate) {
    const defaultEnd = new Date();
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - 30);
    return { startDate: defaultStart, endDate: defaultEnd };
  }

  return { startDate, endDate };
};

const buildDateFilter = ({ startDate, endDate }) => {
  const filter = {};
  if (startDate) filter.$gte = startDate;
  if (endDate) filter.$lte = endDate;
  return Object.keys(filter).length ? filter : null;
};

const getPerformanceMetrics = async (req, res) => {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'Company context is required' });
    }

    const { startDate, endDate } = getDateRange(req);
    const dateFilter = buildDateFilter({ startDate, endDate });

    const visitFilter = {
      companyId,
      isDeleted: false,
      ...(dateFilter ? { visitDate: dateFilter } : {}),
    };
    const orderFilter = {
      companyId,
      isDeleted: false,
      ...(dateFilter ? { createdAt: dateFilter } : {}),
    };
    const collectionFilter = {
      companyId,
      isDeleted: false,
      ...(dateFilter ? { collectedAt: dateFilter } : {}),
    };
    const attendanceFilter = {
      companyId,
      ...(dateFilter ? { attendanceDate: dateFilter } : {}),
    };

    const [visitsCount, ordersCount, revenueAgg, collectionAgg, attendanceAgg] = await Promise.all([
      Visit.countDocuments(visitFilter),
      Order.countDocuments(orderFilter),
      Order.aggregate([
        { $match: orderFilter },
        { $group: { _id: null, totalRevenue: { $sum: { $ifNull: ['$total', 0] } } } },
      ]),
      CollectionRecord.aggregate([
        { $match: collectionFilter },
        { $group: { _id: null, totalCollected: { $sum: { $ifNull: ['$amountCollected', 0] } } } },
      ]),
      Attendance.aggregate([
        { $match: attendanceFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const totalCollected = collectionAgg[0]?.totalCollected || 0;
    const avgOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0;
    const attendanceSummary = attendanceAgg.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalVisits: visitsCount,
        totalOrders: ordersCount,
        totalRevenue,
        totalCollected,
        avgOrderValue,
        attendance: attendanceSummary,
        period: { startDate: startDate?.toISOString() || null, endDate: endDate?.toISOString() || null },
      },
      message: 'Performance metrics retrieved',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSalesmanPerformance = async (req, res) => {
  try {
    const companyId = resolveCompanyId(req);
    const { salesmanId } = req.params;

    if (!companyId) {
      return res.status(400).json({ success: false, message: 'Company context is required' });
    }

    const salesman = await Salesman.findOne({ _id: salesmanId, companyId, isDeleted: false });
    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    const { startDate, endDate } = getDateRange(req);
    const dateFilter = buildDateFilter({ startDate, endDate });

    const visitFilter = {
      companyId,
      salesman: salesmanId,
      isDeleted: false,
      ...(dateFilter ? { visitDate: dateFilter } : {}),
    };
    const orderFilter = {
      companyId,
      isDeleted: false,
      ...(dateFilter ? { createdAt: dateFilter } : {}),
    };
    const visitOrderIds = await Visit.find(visitFilter, { orderGenerated: 1, _id: 0 }).lean();
    const orderIds = visitOrderIds
      .map((item) => item.orderGenerated)
      .filter(Boolean)
      .map((id) => (mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id));

    const [visitsCount, ordersCount, ordersRevenueAgg, collectionsAgg, attendanceAgg] = await Promise.all([
      Visit.countDocuments(visitFilter),
      orderIds.length > 0
        ? Order.countDocuments({ _id: { $in: orderIds }, companyId, isDeleted: false })
        : 0,
      orderIds.length > 0
        ? Order.aggregate([
            { $match: { _id: { $in: orderIds }, companyId, isDeleted: false } },
            { $group: { _id: null, totalRevenue: { $sum: { $ifNull: ['$total', 0] } } } },
          ])
        : [{ totalRevenue: 0 }],
      CollectionRecord.aggregate([
        {
          $match: {
            companyId,
            collectedBy: salesmanId,
            isDeleted: false,
            ...(dateFilter ? { collectedAt: dateFilter } : {}),
          },
        },
        { $group: { _id: null, totalCollected: { $sum: { $ifNull: ['$amountCollected', 0] } } } },
      ]),
      Attendance.aggregate([
        {
          $match: {
            companyId,
            salesman: salesmanId,
            ...(dateFilter ? { attendanceDate: dateFilter } : {}),
          },
        },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const totalRevenue = ordersRevenueAgg[0]?.totalRevenue || 0;
    const totalCollected = collectionsAgg[0]?.totalCollected || 0;
    const avgOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0;
    const attendanceSummary = attendanceAgg.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        salesmanId,
        salesmanName: `${salesman.firstName || ''} ${salesman.lastName || ''}`.trim(),
        totalVisits: visitsCount,
        totalOrders: ordersCount,
        totalRevenue,
        totalCollected,
        avgOrderValue,
        attendance: attendanceSummary,
        period: { startDate: startDate?.toISOString() || null, endDate: endDate?.toISOString() || null },
      },
      message: 'Salesman performance retrieved',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPerformanceMetrics,
  getSalesmanPerformance,
};
