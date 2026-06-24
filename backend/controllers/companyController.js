const Company = require('../models/Company');

// Get all companies
const getCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const companies = await Company.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Company.countDocuments();

    res.json({
      success: true,
      data: companies,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single company
const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create company
const createCompany = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required' });
    }

    const company = new Company({
      ...req.body,
      status: 'pending',
    });

    await company.save();
    res.status(201).json({ success: true, data: company, message: 'Company created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update company
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      req.body,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, data: company, message: 'Company updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve company
const approveCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      { status: 'approved' },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, data: company, message: 'Company approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject company
const rejectCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      { status: 'rejected', rejectionReason: req.body.reason },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, data: company, message: 'Company rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.companyId);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
