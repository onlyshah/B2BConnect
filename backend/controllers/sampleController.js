const Sample = require('../models/Sample');

// Get all samples
const getSamples = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const samples = await Sample.find({ tenantId: req.tenantId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('productId');

    const total = await Sample.countDocuments({ tenantId: req.tenantId });

    res.json({
      success: true,
      data: samples,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single sample
const getSample = async (req, res) => {
  try {
    const sample = await Sample.findOne({
      _id: req.params.sampleId,
      tenantId: req.tenantId,
    }).populate('productId');

    if (!sample) {
      return res.status(404).json({ success: false, message: 'Sample not found' });
    }

    res.json({ success: true, data: sample });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create sample
const createSample = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const sample = new Sample({
      ...req.body,
      tenantId: req.tenantId,
    });

    await sample.save();
    await sample.populate('productId');

    res.status(201).json({ success: true, data: sample, message: 'Sample created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update sample
const updateSample = async (req, res) => {
  try {
    const sample = await Sample.findOneAndUpdate(
      { _id: req.params.sampleId, tenantId: req.tenantId },
      req.body,
      { new: true }
    ).populate('productId');

    if (!sample) {
      return res.status(404).json({ success: false, message: 'Sample not found' });
    }

    res.json({ success: true, data: sample, message: 'Sample updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete sample
const deleteSample = async (req, res) => {
  try {
    const sample = await Sample.findOneAndDelete({
      _id: req.params.sampleId,
      tenantId: req.tenantId,
    });

    if (!sample) {
      return res.status(404).json({ success: false, message: 'Sample not found' });
    }

    res.json({ success: true, message: 'Sample deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSamples,
  getSample,
  createSample,
  updateSample,
  deleteSample,
};
