const Payment = require('../models/Payment');
const { successResponse, errorResponse } = require('../utils/response');
const { buildTenantFilter, getPagination } = require('../utils/tenantScope');

const getPayments = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const filter = buildTenantFilter(req);
    const [payments, total] = await Promise.all([
      Payment.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Payment.countDocuments(filter),
    ]);

    return successResponse(res, {
      message: 'Payments retrieved successfully',
      data: payments,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.paymentId, ...buildTenantFilter(req) }).lean();
    if (!payment) return errorResponse(res, { status: 404, message: 'Payment not found' });
    return successResponse(res, { message: 'Payment retrieved successfully', data: payment });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const payment = new Payment({ ...req.body, tenantId: req.tenantId });
    await payment.save();
    return successResponse(res, { status: 201, message: 'Payment created successfully', data: payment });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

module.exports = { getPayments, getPayment, createPayment };
