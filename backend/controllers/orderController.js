const Order = require('../models/Order');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

function buildOrderFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

// Get all orders
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find(buildOrderFilter(req))
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('retailerId')
      .populate('items.productId');

    const total = await Order.countDocuments(buildOrderFilter(req));

    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      ...buildOrderFilter(req),
    })
      .populate('retailerId')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const { retailerId, items } = req.body;

    if (!retailerId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Retailer ID and items are required' });
    }

    const order = new Order({
      ...req.body,
      tenantId: req.tenantId,
      companyId: resolveCompanyId(req),
      status: 'pending',
    });

    await order.save();
    res.status(201).json({ success: true, data: order, message: 'Order created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildOrderFilter(req) },
      req.body,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order, message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve order
const approveOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildOrderFilter(req) },
      { status: 'confirmed' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order, message: 'Order approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject order
const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildOrderFilter(req) },
      { status: 'cancelled', rejectionReason: req.body.reason },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order, message: 'Order rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dispatch order
const dispatchOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildOrderFilter(req) },
      { status: 'shipped', dispatchedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order, message: 'Order dispatched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildOrderFilter(req) },
      { isDeleted: true, deletedAt: new Date(), status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  approveOrder,
  rejectOrder,
  dispatchOrder,
  deleteOrder,
};
