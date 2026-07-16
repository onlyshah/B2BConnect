const Distributor = require('../models/Distributor');
const { successResponse, errorResponse } = require('../utils/response');
const { buildTenantFilter, getPagination, resolveCompanyId } = require('../utils/tenantScope');

const getDistributors = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const filter = buildTenantFilter(req);
    const [distributors, total] = await Promise.all([
      Distributor.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Distributor.countDocuments(filter),
    ]);

    return successResponse(res, {
      message: 'Distributors retrieved successfully',
      data: distributors,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOne({ _id: req.params.distributorId, ...buildTenantFilter(req) }).lean();
    if (!distributor) return errorResponse(res, { status: 404, message: 'Distributor not found' });
    return successResponse(res, { message: 'Distributor retrieved successfully', data: distributor });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const createDistributor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return errorResponse(res, { status: 400, message: 'Name is required' });

    const distributor = new Distributor({ ...req.body, tenantId: req.tenantId, companyId: resolveCompanyId(req), status: 'pending' });
    await distributor.save();
    return successResponse(res, { status: 201, message: 'Distributor created successfully', data: distributor });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const updateDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      { _id: req.params.distributorId, ...buildTenantFilter(req) },
      req.body,
      { new: true }
    );
    if (!distributor) return errorResponse(res, { status: 404, message: 'Distributor not found' });
    return successResponse(res, { message: 'Distributor updated successfully', data: distributor });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const approveDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      { _id: req.params.distributorId, ...buildTenantFilter(req) },
      { status: 'active' },
      { new: true }
    );
    if (!distributor) return errorResponse(res, { status: 404, message: 'Distributor not found' });
    return successResponse(res, { message: 'Distributor approved successfully', data: distributor });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const rejectDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      { _id: req.params.distributorId, ...buildTenantFilter(req) },
      { status: 'inactive', rejectionReason: req.body.reason },
      { new: true }
    );
    if (!distributor) return errorResponse(res, { status: 404, message: 'Distributor not found' });
    return successResponse(res, { message: 'Distributor rejected successfully', data: distributor });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const deleteDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      { _id: req.params.distributorId, ...buildTenantFilter(req) },
      { isDeleted: true, deletedAt: new Date(), status: 'inactive' },
      { new: true }
    );
    if (!distributor) return errorResponse(res, { status: 404, message: 'Distributor not found' });
    return successResponse(res, { message: 'Distributor deleted successfully' });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

module.exports = { getDistributors, getDistributor, createDistributor, updateDistributor, approveDistributor, rejectDistributor, deleteDistributor };
