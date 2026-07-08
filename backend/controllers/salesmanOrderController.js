const SalesmanOrder = require('../models/SalesmanOrder');

const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

const buildFilter = (req, extra = {}) => ({
  companyId: resolveCompanyId(req),
  ...extra,
});

const getSalesmanOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = buildFilter(req);
    if (req.query.salesmanId) filter.salesmanId = req.query.salesmanId;
    if (req.query.orderId) filter.orderId = req.query.orderId;

    const rows = await SalesmanOrder.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('salesmanId')
      .populate('orderId');

    const total = await SalesmanOrder.countDocuments(filter);

    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      message: 'Get salesman orders',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSalesmanOrderById = async (req, res) => {
  try {
    const row = await SalesmanOrder.findOne({
      _id: req.params.id,
      ...buildFilter(req),
    })
      .populate('salesmanId')
      .populate('orderId');

    if (!row) {
      return res.status(404).json({ success: false, message: 'Salesman order not found' });
    }

    res.json({
      success: true,
      data: row,
      message: 'Get salesman order',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSalesmanOrder = async (req, res) => {
  try {
    const { salesmanId, orderId, status, notes } = req.body;

    if (!salesmanId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'salesmanId and orderId are required',
      });
    }

    const row = new SalesmanOrder({
      companyId: resolveCompanyId(req),
      salesmanId,
      orderId,
      status: status || 'linked',
      notes: notes || '',
    });

    await row.save();
    await row.populate('salesmanId');
    await row.populate('orderId');

    res.status(201).json({
      success: true,
      data: row,
      message: 'Salesman order created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSalesmanOrders,
  getSalesmanOrderById,
  createSalesmanOrder,
};
