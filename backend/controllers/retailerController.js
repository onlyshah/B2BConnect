const Retailer = require('../models/Retailer');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

function buildRetailerFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

const getRetailers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const retailers = await Retailer.find(buildRetailerFilter(req))
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Retailer.countDocuments(buildRetailerFilter(req));
    res.json({ success: true, data: retailers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOne({ _id: req.params.retailerId, ...buildRetailerFilter(req) });
    if (!retailer) return res.status(404).json({ success: false, message: 'Retailer not found' });
    res.json({ success: true, data: retailer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRetailer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required' });
    }

    const retailer = new Retailer({
      ...req.body,
      tenantId: req.tenantId,
      companyId: resolveCompanyId(req),
      status: 'pending',
    });

    await retailer.save();
    res.status(201).json({ success: true, data: retailer, message: 'Retailer created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOneAndUpdate(
      { _id: req.params.retailerId, ...buildRetailerFilter(req) },
      req.body,
      { new: true }
    );
    if (!retailer) return res.status(404).json({ success: false, message: 'Retailer not found' });
    res.json({ success: true, data: retailer, message: 'Retailer updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOneAndUpdate(
      { _id: req.params.retailerId, ...buildRetailerFilter(req) },
      { status: 'active' },
      { new: true }
    );
    if (!retailer) return res.status(404).json({ success: false, message: 'Retailer not found' });
    res.json({ success: true, data: retailer, message: 'Retailer approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOneAndUpdate(
      { _id: req.params.retailerId, ...buildRetailerFilter(req) },
      { isDeleted: true, deletedAt: new Date(), status: 'inactive' },
      { new: true }
    );
    if (!retailer) return res.status(404).json({ success: false, message: 'Retailer not found' });
    res.json({ success: true, message: 'Retailer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRetailers, getRetailer, createRetailer, updateRetailer, approveRetailer, deleteRetailer };
