const Salesman = require('../models/Salesman');
const mongoose = require('mongoose');
const Visit = require('../models/Visit');
const Order = require('../models/Order');
const Attendance = require('../models/Attendance');
const CollectionRecord = require('../models/CollectionRecord');
const User = require('../models/User');

// Get all salesmen
const getSalesmen = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const salesmen = await Salesman.find({ tenantId: req.tenantId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Salesman.countDocuments({ tenantId: req.tenantId });

    res.json({
      success: true,
      data: salesmen,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single salesman
const getSalesman = async (req, res) => {
  try {
    const salesman = await Salesman.findOne({
      _id: req.params.salesmanId,
      tenantId: req.tenantId,
    });

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, data: salesman });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create salesman
const createSalesman = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'First name, last name, email, and phone are required' });
    }

    const salesman = new Salesman({
      ...req.body,
      tenantId: req.tenantId,
      status: 'active',
    });

    await salesman.save();
    res.status(201).json({ success: true, data: salesman, message: 'Salesman created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update salesman
const updateSalesman = async (req, res) => {
  try {
    const salesman = await Salesman.findOneAndUpdate(
      { _id: req.params.salesmanId, tenantId: req.tenantId },
      req.body,
      { new: true }
    );

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, data: salesman, message: 'Salesman updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign retailers to salesman
const assignRetailers = async (req, res) => {
  try {
    const { retailerIds } = req.body;

    if (!Array.isArray(retailerIds)) {
      return res.status(400).json({ success: false, message: 'Retailer IDs must be an array' });
    }

    const salesman = await Salesman.findOneAndUpdate(
      { _id: req.params.salesmanId, tenantId: req.tenantId },
      { assignedRetailers: retailerIds },
      { new: true }
    );

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, data: salesman, message: 'Retailers assigned' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign territory to salesman
const assignTerritory = async (req, res) => {
  try {
    const { territory } = req.body;

    if (!Array.isArray(territory)) {
      return res.status(400).json({ success: false, message: 'Territory must be an array' });
    }

    const salesman = await Salesman.findOneAndUpdate(
      { _id: req.params.salesmanId, tenantId: req.tenantId },
      { territory },
      { new: true }
    );

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, data: salesman, message: 'Territory assigned' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get salesman performance (aggregated from visits, orders, attendance, collections)
const getPerformance = async (req, res) => {
  try {
    const salesmanId = req.params.salesmanId;
    const tenantId = req.tenantId;

    const salesman = await Salesman.findOne({ _id: salesmanId, tenantId });
    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

    // Visits
    const todaysVisitsCount = await Visit.countDocuments({
      tenantId,
      salesman: salesmanId,
      visitDate: { $gte: startOfToday, $lt: endOfToday }
    });

    const monthlyVisitsCount = await Visit.countDocuments({
      tenantId,
      salesman: salesmanId,
      visitDate: { $gte: startOfMonth }
    });

    // Orders generated via visits -> orderGenerated
    const ordersAgg = await Visit.aggregate([
      { $match: { tenantId: mongoose.Types.ObjectId(tenantId), salesman: mongoose.Types.ObjectId(salesmanId), orderGenerated: { $exists: true, $ne: null } } },
      { $lookup: { from: 'orders', localField: 'orderGenerated', foreignField: '_id', as: 'order' } },
      { $unwind: { path: '$order', preserveNullAndEmptyArrays: false } },
      { $group: { _id: null, ordersCount: { $sum: 1 }, revenue: { $sum: { $ifNull: ['$order.total', 0] } } } }
    ]);

    const ordersCount = (ordersAgg[0] && ordersAgg[0].ordersCount) || 0;
    const ordersRevenue = (ordersAgg[0] && ordersAgg[0].revenue) || 0;

    // Collections: find user(s) mapped to this salesman and sum CollectionRecord.amountCollected
    const salesmanUsers = await User.find({ tenantId, salesmanId: salesmanId }, { _id: 1 }).lean();
    const userIds = salesmanUsers.map((u) => u._id);

    let collectionsTotal = 0;
    if (userIds.length > 0) {
      const collAgg = await CollectionRecord.aggregate([
        { $match: { tenantId: mongoose.Types.ObjectId(tenantId), collectedBy: { $in: userIds } } },
        { $group: { _id: null, totalCollected: { $sum: '$amountCollected' } } }
      ]);
      collectionsTotal = (collAgg[0] && collAgg[0].totalCollected) || 0;
    }

    // Attendance today
    const attendanceToday = await Attendance.findOne({
      tenantId,
      salesman: salesmanId,
      attendanceDate: { $gte: startOfToday, $lt: endOfToday }
    }).lean();

    const performance = {
      salesmanId,
      name: `${salesman.firstName} ${salesman.lastName}`,
      todaysVisits: todaysVisitsCount,
      monthlyVisits: monthlyVisitsCount,
      ordersCount,
      ordersRevenue,
      collectionsTotal,
      attendanceToday: attendanceToday ? {
        status: attendanceToday.status,
        checkInTime: attendanceToday.checkInTime,
        checkOutTime: attendanceToday.checkOutTime,
        workingHours: attendanceToday.workingHours || 0,
        completedVisits: attendanceToday.completedVisits || 0
      } : null,
      targets: {
        dailyVisitTarget: salesman.dailyVisitTarget || 0,
        monthlyOrderTarget: salesman.monthlyOrderTarget || 0
      }
    };

    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete salesman
const deleteSalesman = async (req, res) => {
  try {
    const salesman = await Salesman.findOneAndDelete({
      _id: req.params.salesmanId,
      tenantId: req.tenantId,
    });

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, message: 'Salesman deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSalesmen,
  getSalesman,
  createSalesman,
  updateSalesman,
  assignRetailers,
  assignTerritory,
  getPerformance,
  deleteSalesman,
};
