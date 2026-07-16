const Company = require('../models/Company');
const { successResponse, errorResponse } = require('../utils/response');
const { getPagination } = require('../utils/tenantScope');

const getCompanies = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const [companies, total] = await Promise.all([
      Company.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Company.countDocuments(),
    ]);

    return successResponse(res, {
      message: 'Companies retrieved successfully',
      data: companies,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId).lean();
    if (!company) return errorResponse(res, { status: 404, message: 'Company not found' });
    return successResponse(res, { message: 'Company retrieved successfully', data: company });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return errorResponse(res, { status: 400, message: 'Name, email, and phone are required' });
    }

    const company = new Company({ ...req.body, status: 'pending' });
    await company.save();
    return successResponse(res, { status: 201, message: 'Company created successfully', data: company });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.companyId, req.body, { new: true });
    if (!company) return errorResponse(res, { status: 404, message: 'Company not found' });
    return successResponse(res, { message: 'Company updated successfully', data: company });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const approveCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.companyId, { status: 'approved' }, { new: true });
    if (!company) return errorResponse(res, { status: 404, message: 'Company not found' });
    return successResponse(res, { message: 'Company approved successfully', data: company });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const rejectCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      { status: 'rejected', rejectionReason: req.body.reason },
      { new: true }
    );
    if (!company) return errorResponse(res, { status: 404, message: 'Company not found' });
    return successResponse(res, { message: 'Company rejected successfully', data: company });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.companyId);
    if (!company) return errorResponse(res, { status: 404, message: 'Company not found' });
    return successResponse(res, { message: 'Company deleted successfully' });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  approveCompany,
  rejectCompany,
  deleteCompany,
};
