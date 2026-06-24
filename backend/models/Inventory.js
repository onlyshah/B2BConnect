const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  distributorId: { type: String, required: true },
  productId: { type: String, required: true },
  stockOnHand: { type: Number, default: 0 },
  reorderLevel: Number,
  reorderQuantity: Number,
  lastRestockDate: Date,
  lastUpdated: { type: Date, default: Date.now },
  alerts: [{
    type: String,
    severity: String,
    date: Date
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

inventorySchema.index({ tenantId: 1, distributorId: 1, productId: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
