const ReturnClaim = require('../models/Return');

// Get all return claims
const getReturns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { retailerId, distributorId, status } = req.query;

    const filter = { tenantId: req.tenantId };
    if (retailerId) filter.retailerId = retailerId;
    if (distributorId) filter.distributorId = distributorId;
    if (status) filter.status = status;

    const claims = await ReturnClaim.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('retailerId')
      .populate('distributorId')
      .populate('items.productId');

    const total = await ReturnClaim.countDocuments(filter);

    res.json({
      success: true,
      data: claims,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single return claim
const getReturn = async (req, res) => {
  try {
    const claim = await ReturnClaim.findOne({
      _id: req.params.returnId,
      tenantId: req.tenantId,
    })
      .populate('retailerId')
      .populate('distributorId')
      .populate('items.productId');

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Return claim not found' });
    }

    res.json({ success: true, data: claim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create return claim
const createReturn = async (req, res) => {
  try {
    const { retailerId, distributorId, items, reason } = req.body;

    if (!retailerId || !distributorId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'retailerId, distributorId, and items are required',
      });
    }

    const claim = new ReturnClaim({
      ...req.body,
      tenantId: req.tenantId,
      status: 'pending',
    });

    await claim.save();
    await claim.populate('retailerId');
    await claim.populate('distributorId');
    await claim.populate('items.productId');

    res.status(201).json({ success: true, data: claim, message: 'Return claim created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update return claim status
const updateReturnStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const claim = await ReturnClaim.findOneAndUpdate(
      { _id: req.params.returnId, tenantId: req.tenantId },
      {
        status,
        resolutionNotes,
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate('retailerId')
      .populate('distributorId')
      .populate('items.productId');

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Return claim not found' });
    }

    res.json({ success: true, data: claim, message: 'Return claim updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete return claim
const deleteReturn = async (req, res) => {
  try {
    const claim = await ReturnClaim.findOneAndDelete({
      _id: req.params.returnId,
      tenantId: req.tenantId,
    });

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Return claim not found' });
    }

    res.json({ success: true, message: 'Return claim deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReturns,
  getReturn,
  createReturn,
  updateReturnStatus,
  deleteReturn,
};
