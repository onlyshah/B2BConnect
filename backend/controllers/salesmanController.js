const Salesman = require('../models/Salesman');

// Get all salesmen
const getSalesmen = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const salesmen = await Salesman.find({ tenantId: req.tenantId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Salesman.countDocuments({ tenantId: req.tenantId });

    res.json({
      success: true,
      data: salesmen,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single salesman
const getSalesman = async (req, res) => {
  try {
    const salesman = await Salesman.findOne({
      _id: req.params.salesmanId,
      tenantId: req.tenantId,
    });

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, data: salesman });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create salesman
const createSalesman = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'First name, last name, email, and phone are required' });
    }

    const salesman = new Salesman({
      ...req.body,
      tenantId: req.tenantId,
      status: 'active',
    });

    await salesman.save();
    res.status(201).json({ success: true, data: salesman, message: 'Salesman created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update salesman
const updateSalesman = async (req, res) => {
  try {
    const salesman = await Salesman.findOneAndUpdate(
      { _id: req.params.salesmanId, tenantId: req.tenantId },
      req.body,
      { new: true }
    );

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, data: salesman, message: 'Salesman updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign retailers to salesman
const assignRetailers = async (req, res) => {
  try {
    const { retailerIds } = req.body;

    if (!Array.isArray(retailerIds)) {
      return res.status(400).json({ success: false, message: 'Retailer IDs must be an array' });
    }

    const salesman = await Salesman.findOneAndUpdate(
      { _id: req.params.salesmanId, tenantId: req.tenantId },
      { assignedRetailers: retailerIds },
      { new: true }
    );

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, data: salesman, message: 'Retailers assigned' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign territory to salesman
const assignTerritory = async (req, res) => {
  try {
    const { territory } = req.body;

    if (!Array.isArray(territory)) {
      return res.status(400).json({ success: false, message: 'Territory must be an array' });
    }

    const salesman = await Salesman.findOneAndUpdate(
      { _id: req.params.salesmanId, tenantId: req.tenantId },
      { territory },
      { new: true }
    );

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, data: salesman, message: 'Territory assigned' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get salesman performance
const getPerformance = async (req, res) => {
  try {
    const salesman = await Salesman.findOne({
      _id: req.params.salesmanId,
      tenantId: req.tenantId,
    });

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, data: salesman.metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete salesman
const deleteSalesman = async (req, res) => {
  try {
    const salesman = await Salesman.findOneAndDelete({
      _id: req.params.salesmanId,
      tenantId: req.tenantId,
    });

    if (!salesman) {
      return res.status(404).json({ success: false, message: 'Salesman not found' });
    }

    res.json({ success: true, message: 'Salesman deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSalesmen,
  getSalesman,
  createSalesman,
  updateSalesman,
  assignRetailers,
  assignTerritory,
  getPerformance,
  deleteSalesman,
};
