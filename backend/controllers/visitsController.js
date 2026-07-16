const Visit = require('../models/Visit');
const { successResponse, errorResponse } = require('../utils/response');
const { buildTenantFilter, getPagination } = require('../utils/tenantScope');

const getVisits = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const filter = buildTenantFilter(req);
    const [visits, total] = await Promise.all([
      Visit.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Visit.countDocuments(filter),
    ]);

    return successResponse(res, {
      message: 'Visits retrieved successfully',
      data: visits,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getVisit = async (req, res) => {
  try {
    const visit = await Visit.findOne({ _id: req.params.visitId, ...buildTenantFilter(req) }).lean();
    if (!visit) return errorResponse(res, { status: 404, message: 'Visit not found' });
    return successResponse(res, { message: 'Visit retrieved successfully', data: visit });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const createVisit = async (req, res) => {
  try {
    const visit = new Visit({ ...req.body, tenantId: req.tenantId });
    await visit.save();
    return successResponse(res, { status: 201, message: 'Visit recorded successfully', data: visit });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

module.exports = { getVisits, getVisit, createVisit };
