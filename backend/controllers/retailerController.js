const Retailer = require('../models/Retailer');

// Get all retailers
const getRetailers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const retailers = await Retailer.find({ tenantId: req.tenantId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Retailer.countDocuments({ tenantId: req.tenantId });

    res.json({
      success: true,
      data: retailers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single retailer
const getRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOne({
      _id: req.params.retailerId,
      tenantId: req.tenantId,
    });

    if (!retailer) {
      return res.status(404).json({ success: false, message: 'Retailer not found' });
    }

    res.json({ success: true, data: retailer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create retailer
const createRetailer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required' });
    }

    const retailer = new Retailer({
      ...req.body,
      tenantId: req.tenantId,
      status: 'pending',
    });

    await retailer.save();
    res.status(201).json({ success: true, data: retailer, message: 'Retailer created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update retailer
const updateRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOneAndUpdate(
      { _id: req.params.retailerId, tenantId: req.tenantId },
      req.body,
      { new: true }
    );

    if (!retailer) {
      return res.status(404).json({ success: false, message: 'Retailer not found' });
    }

    res.json({ success: true, data: retailer, message: 'Retailer updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve retailer
const approveRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOneAndUpdate(
      { _id: req.params.retailerId, tenantId: req.tenantId },
      { status: 'approved' },
      { new: true }
    );

    if (!retailer) {
      return res.status(404).json({ success: false, message: 'Retailer not found' });
    }

    res.json({ success: true, data: retailer, message: 'Retailer approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete retailer
const deleteRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOneAndDelete({
      _id: req.params.retailerId,
      tenantId: req.tenantId,
    });

    if (!retailer) {
      return res.status(404).json({ success: false, message: 'Retailer not found' });
    }

    res.json({ success: true, message: 'Retailer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRetailers,
  getRetailer,
  createRetailer,
  updateRetailer,
  approveRetailer,
  deleteRetailer,
};
