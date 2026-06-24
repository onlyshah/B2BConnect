const Distributor = require('../models/Distributor');

// Get all distributors
const getDistributors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const distributors = await Distributor.find({ tenantId: req.tenantId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Distributor.countDocuments({ tenantId: req.tenantId });

    res.json({
      success: true,
      data: distributors,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single distributor
const getDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOne({
      _id: req.params.distributorId,
      tenantId: req.tenantId,
    });

    if (!distributor) {
      return res.status(404).json({ success: false, message: 'Distributor not found' });
    }

    res.json({ success: true, data: distributor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create distributor
const createDistributor = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required' });
    }

    const distributor = new Distributor({
      ...req.body,
      tenantId: req.tenantId,
      status: 'pending',
    });

    await distributor.save();
    res.status(201).json({ success: true, data: distributor, message: 'Distributor created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update distributor
const updateDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      { _id: req.params.distributorId, tenantId: req.tenantId },
      req.body,
      { new: true }
    );

    if (!distributor) {
      return res.status(404).json({ success: false, message: 'Distributor not found' });
    }

    res.json({ success: true, data: distributor, message: 'Distributor updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve distributor
const approveDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      { _id: req.params.distributorId, tenantId: req.tenantId },
      { status: 'approved' },
      { new: true }
    );

    if (!distributor) {
      return res.status(404).json({ success: false, message: 'Distributor not found' });
    }

    res.json({ success: true, data: distributor, message: 'Distributor approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject distributor
const rejectDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      { _id: req.params.distributorId, tenantId: req.tenantId },
      { status: 'rejected', rejectionReason: req.body.reason },
      { new: true }
    );

    if (!distributor) {
      return res.status(404).json({ success: false, message: 'Distributor not found' });
    }

    res.json({ success: true, data: distributor, message: 'Distributor rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete distributor
const deleteDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndDelete({
      _id: req.params.distributorId,
      tenantId: req.tenantId,
    });

    if (!distributor) {
      return res.status(404).json({ success: false, message: 'Distributor not found' });
    }

    res.json({ success: true, message: 'Distributor deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDistributors,
  getDistributor,
  createDistributor,
  updateDistributor,
  approveDistributor,
  rejectDistributor,
  deleteDistributor,
};
