const Distributor = require('../models/Distributor');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

function buildDistributorFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

const getDistributors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const distributors = await Distributor.find(buildDistributorFilter(req)).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Distributor.countDocuments(buildDistributorFilter(req));
    res.json({ success: true, data: distributors, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOne({ _id: req.params.distributorId, ...buildDistributorFilter(req) });
    if (!distributor) return res.status(404).json({ success: false, message: 'Distributor not found' });
    res.json({ success: true, data: distributor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDistributor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const distributor = new Distributor({ ...req.body, tenantId: req.tenantId, companyId: resolveCompanyId(req), status: 'pending' });
    await distributor.save();
    res.status(201).json({ success: true, data: distributor, message: 'Distributor created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate({ _id: req.params.distributorId, ...buildDistributorFilter(req) }, req.body, { new: true });
    if (!distributor) return res.status(404).json({ success: false, message: 'Distributor not found' });
    res.json({ success: true, data: distributor, message: 'Distributor updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate({ _id: req.params.distributorId, ...buildDistributorFilter(req) }, { status: 'active' }, { new: true });
    if (!distributor) return res.status(404).json({ success: false, message: 'Distributor not found' });
    res.json({ success: true, data: distributor, message: 'Distributor approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate({ _id: req.params.distributorId, ...buildDistributorFilter(req) }, { status: 'inactive', rejectionReason: req.body.reason }, { new: true });
    if (!distributor) return res.status(404).json({ success: false, message: 'Distributor not found' });
    res.json({ success: true, data: distributor, message: 'Distributor rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      { _id: req.params.distributorId, ...buildDistributorFilter(req) },
      { isDeleted: true, deletedAt: new Date(), status: 'inactive' },
      { new: true }
    );
    if (!distributor) return res.status(404).json({ success: false, message: 'Distributor not found' });
    res.json({ success: true, message: 'Distributor deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDistributors, getDistributor, createDistributor, updateDistributor, approveDistributor, rejectDistributor, deleteDistributor };
