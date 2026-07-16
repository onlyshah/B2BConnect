const Retailer = require('../models/Retailer');
const { successResponse, errorResponse } = require('../utils/response');
const { buildTenantFilter, getPagination, resolveCompanyId } = require('../utils/tenantScope');

const getRetailers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const filter = buildTenantFilter(req);
    const [retailers, total] = await Promise.all([
      Retailer.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Retailer.countDocuments(filter),
    ]);

    return successResponse(res, {
      message: 'Retailers retrieved successfully',
      data: retailers,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOne({ _id: req.params.retailerId, ...buildTenantFilter(req) }).lean();
    if (!retailer) return errorResponse(res, { status: 404, message: 'Retailer not found' });
    return successResponse(res, { message: 'Retailer retrieved successfully', data: retailer });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const createRetailer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return errorResponse(res, { status: 400, message: 'Name, email, and phone are required' });
    }

    const retailer = new Retailer({ ...req.body, tenantId: req.tenantId, companyId: resolveCompanyId(req), status: 'pending' });
    await retailer.save();
    return successResponse(res, { status: 201, message: 'Retailer created successfully', data: retailer });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const updateRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOneAndUpdate(
      { _id: req.params.retailerId, ...buildTenantFilter(req) },
      req.body,
      { new: true }
    );
    if (!retailer) return errorResponse(res, { status: 404, message: 'Retailer not found' });
    return successResponse(res, { message: 'Retailer updated successfully', data: retailer });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const approveRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOneAndUpdate(
      { _id: req.params.retailerId, ...buildTenantFilter(req) },
      { status: 'active' },
      { new: true }
    );
    if (!retailer) return errorResponse(res, { status: 404, message: 'Retailer not found' });
    return successResponse(res, { message: 'Retailer approved successfully', data: retailer });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const deleteRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOneAndUpdate(
      { _id: req.params.retailerId, ...buildTenantFilter(req) },
      { isDeleted: true, deletedAt: new Date(), status: 'inactive' },
      { new: true }
    );
    if (!retailer) return errorResponse(res, { status: 404, message: 'Retailer not found' });
    return successResponse(res, { message: 'Retailer deleted successfully' });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

module.exports = { getRetailers, getRetailer, createRetailer, updateRetailer, approveRetailer, deleteRetailer };
