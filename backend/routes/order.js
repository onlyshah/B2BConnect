const express = require('express');
const Order = require('../models/Order');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, ensureTenant, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ tenantId: req.tenantId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments({ tenantId: req.tenantId });

  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

router.post('/', authenticate, ensureTenant, async (req, res) => {
  try {
    if (req.body.orderType === 'retailer-order' && !req.body.retailerId) {
      return res.status(400).json({ success: false, message: 'retailerId is required for retailer orders' });
    }
    if (req.body.orderType === 'distributor-replenishment' && !req.body.distributorId) {
      return res.status(400).json({ success: false, message: 'distributorId is required for replenishment orders' });
    }

    const subtotal = (req.body.items || []).reduce((sum, item) => {
      const line = (item.quantity || 0) * (item.unitPrice || 0);
      return sum + line - (item.discount || 0);
    }, 0);
    const tax = req.body.tax ?? 0;

    const order = new Order({
      ...req.body,
      tenantId: req.tenantId,
      subtotal: req.body.subtotal ?? subtotal,
      tax,
      total: req.body.total ?? subtotal + tax,
      status: 'draft',
    });
    await order.save();
    res.status(201).json({ success: true, data: order, message: 'Order created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:orderId', authenticate, ensureTenant, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, tenantId: req.tenantId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put(
  '/:orderId',
  authenticate,
  ensureTenant,
  authorize(['super-admin', 'company-admin', 'distributor-admin']),
  async (req, res) => {
    try {
      const order = await Order.findOneAndUpdate({ _id: req.params.orderId, tenantId: req.tenantId }, req.body, { new: true });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      res.json({ success: true, data: order, message: 'Order updated' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Approve order
router.post(
  '/:orderId/approve',
  authenticate,
  ensureTenant,
  authorize(['super-admin', 'company-admin']),
  async (req, res) => {
    try {
      const order = await Order.findOneAndUpdate(
        { _id: req.params.orderId, tenantId: req.tenantId },
        { status: 'approved', approvedAt: new Date() },
        { new: true }
      );
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      res.json({ success: true, data: order, message: 'Order approved' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Reject order
router.post(
  '/:orderId/reject',
  authenticate,
  ensureTenant,
  authorize(['super-admin', 'company-admin']),
  async (req, res) => {
    try {
      const order = await Order.findOneAndUpdate(
        { _id: req.params.orderId, tenantId: req.tenantId },
        { status: 'rejected', rejectionReason: req.body.reason, rejectedAt: new Date() },
        { new: true }
      );
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      res.json({ success: true, data: order, message: 'Order rejected' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Dispatch order
router.post(
  '/:orderId/dispatch',
  authenticate,
  ensureTenant,
  authorize(['super-admin', 'company-admin']),
  async (req, res) => {
    try {
      const order = await Order.findOneAndUpdate(
        { _id: req.params.orderId, tenantId: req.tenantId },
        { status: 'dispatched', dispatchedAt: new Date() },
        { new: true }
      );
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      res.json({ success: true, data: order, message: 'Order dispatched' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
