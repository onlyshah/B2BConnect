const Inventory = require('../models/Inventory');

// Get inventory
const getInventory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const inventory = await Inventory.find({ tenantId: req.tenantId })
      .skip(skip)
      .limit(limit)
      .populate('productId');

    const total = await Inventory.countDocuments({ tenantId: req.tenantId });

    res.json({
      success: true,
      data: inventory,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single inventory item
const getInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findOne({
      _id: req.params.itemId,
      tenantId: req.tenantId,
    }).populate('productId');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update inventory stock
const updateInventoryStock = async (req, res) => {
  try {
    const { quantity, type } = req.body;

    if (!quantity || !type) {
      return res.status(400).json({ success: false, message: 'Quantity and type are required' });
    }

    let item = await Inventory.findOne({
      _id: req.params.itemId,
      tenantId: req.tenantId,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    if (type === 'add') {
      item.quantity += quantity;
    } else if (type === 'reduce') {
      item.quantity = Math.max(0, item.quantity - quantity);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type. Use "add" or "reduce"' });
    }

    item.updatedAt = new Date();
    await item.save();

    res.json({ success: true, data: item, message: 'Inventory updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get low stock items
const getLowStockItems = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;

    const items = await Inventory.find({
      tenantId: req.tenantId,
      quantity: { $lte: threshold },
    }).populate('productId');

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInventory,
  getInventoryItem,
  updateInventoryStock,
  getLowStockItems,
};
