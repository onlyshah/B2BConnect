const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../utils/response');
const { buildTenantFilter, getPagination } = require('../utils/tenantScope');

const getOrders = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const filter = buildTenantFilter(req);
    const [orders, total] = await Promise.all([
      Order.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Order.countDocuments(filter),
    ]);

    return successResponse(res, {
      message: 'Orders retrieved successfully',
      data: orders,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, ...buildTenantFilter(req) }).lean();
    if (!order) return errorResponse(res, { status: 404, message: 'Order not found' });
    return successResponse(res, { message: 'Order retrieved successfully', data: order });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { retailerId, items } = req.body;
    if (!retailerId || !items || items.length === 0) {
      return errorResponse(res, { status: 400, message: 'Retailer ID and items are required' });
    }

    const order = new Order({ ...req.body, tenantId: req.tenantId, status: 'pending' });
    await order.save();
    return successResponse(res, { status: 201, message: 'Order created successfully', data: order });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildTenantFilter(req) },
      req.body,
      { new: true }
    );
    if (!order) return errorResponse(res, { status: 404, message: 'Order not found' });
    return successResponse(res, { message: 'Order updated successfully', data: order });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const approveOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildTenantFilter(req) },
      { status: 'approved' },
      { new: true }
    );
    if (!order) return errorResponse(res, { status: 404, message: 'Order not found' });
    return successResponse(res, { message: 'Order approved successfully', data: order });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildTenantFilter(req) },
      { status: 'rejected' },
      { new: true }
    );
    if (!order) return errorResponse(res, { status: 404, message: 'Order not found' });
    return successResponse(res, { message: 'Order rejected successfully', data: order });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const dispatchOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildTenantFilter(req) },
      { status: 'dispatched' },
      { new: true }
    );
    if (!order) return errorResponse(res, { status: 404, message: 'Order not found' });
    return successResponse(res, { message: 'Order dispatched successfully', data: order });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, ...buildTenantFilter(req) },
      { isDeleted: true, deletedAt: new Date(), status: 'cancelled' },
      { new: true }
    );
    if (!order) return errorResponse(res, { status: 404, message: 'Order not found' });
    return successResponse(res, { message: 'Order deleted successfully' });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
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
