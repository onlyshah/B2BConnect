const Inventory = require('../models/Inventory');
const { successResponse, errorResponse } = require('../utils/response');
const { buildTenantFilter, getPagination } = require('../utils/tenantScope');

const getInventory = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const filter = buildTenantFilter(req);
    const [inventory, total] = await Promise.all([
      Inventory.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('productId').lean(),
      Inventory.countDocuments(filter),
    ]);

    return successResponse(res, {
      message: 'Inventory retrieved successfully',
      data: inventory,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findOne({ _id: req.params.itemId, ...buildTenantFilter(req) }).populate('productId').lean();
    if (!item) return errorResponse(res, { status: 404, message: 'Inventory item not found' });
    return successResponse(res, { message: 'Inventory item retrieved successfully', data: item });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const updateInventoryStock = async (req, res) => {
  try {
    const { quantity, type } = req.body;
    if (!quantity || !type) {
      return errorResponse(res, { status: 400, message: 'Quantity and type are required' });
    }

    const item = await Inventory.findOne({ _id: req.params.itemId, ...buildTenantFilter(req) });
    if (!item) return errorResponse(res, { status: 404, message: 'Inventory item not found' });

    if (type === 'add') item.stockOnHand += quantity;
    else if (type === 'reduce') item.stockOnHand = Math.max(0, item.stockOnHand - quantity);
    else return errorResponse(res, { status: 400, message: 'Invalid type. Use "add" or "reduce"' });

    item.updatedAt = new Date();
    await item.save();
    await item.populate('productId');
    return successResponse(res, { message: 'Inventory updated successfully', data: item });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getLowStockItems = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    const filter = { ...buildTenantFilter(req), stockOnHand: { $lte: threshold } };
    const items = await Inventory.find(filter).populate('productId').lean();
    return successResponse(res, { message: 'Low stock items retrieved successfully', data: items });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

module.exports = { getInventory, getInventoryItem, updateInventoryStock, getLowStockItems };
