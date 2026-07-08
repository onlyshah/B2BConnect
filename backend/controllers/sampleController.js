const Sample = require('../models/Sample');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

function buildSampleFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

const getSamples = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const samples = await Sample.find(buildSampleFilter(req)).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('productId');
    const total = await Sample.countDocuments(buildSampleFilter(req));
    res.json({ success: true, data: samples, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSample = async (req, res) => {
  try {
    const sample = await Sample.findOne({ _id: req.params.sampleId, ...buildSampleFilter(req) }).populate('productId');
    if (!sample) return res.status(404).json({ success: false, message: 'Sample not found' });
    res.json({ success: true, data: sample });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSample = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID is required' });
    const sample = new Sample({ ...req.body, tenantId: req.tenantId, companyId: resolveCompanyId(req) });
    await sample.save();
    await sample.populate('productId');
    res.status(201).json({ success: true, data: sample, message: 'Sample created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSample = async (req, res) => {
  try {
    const sample = await Sample.findOneAndUpdate({ _id: req.params.sampleId, ...buildSampleFilter(req) }, req.body, { new: true }).populate('productId');
    if (!sample) return res.status(404).json({ success: false, message: 'Sample not found' });
    res.json({ success: true, data: sample, message: 'Sample updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSample = async (req, res) => {
  try {
    const sample = await Sample.findOneAndUpdate(
      { _id: req.params.sampleId, ...buildSampleFilter(req) },
      { isDeleted: true, deletedAt: new Date(), status: 'rejected' },
      { new: true }
    );
    if (!sample) return res.status(404).json({ success: false, message: 'Sample not found' });
    res.json({ success: true, message: 'Sample deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSamples, getSample, createSample, updateSample, deleteSample };
