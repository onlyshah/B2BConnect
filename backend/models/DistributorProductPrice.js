const mongoose = require('mongoose');

const distributorProductPriceSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  companyId: { type: String, required: true, index: true },
  distributorId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  retailerCategory: { type: String, enum: ['silver', 'gold', 'platinum', 'all'], default: 'all' },
  basePrice: { type: Number, required: true },
  discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
  discountValue: { type: Number, default: 0 },
  minQuantity: { type: Number, default: 1 },
  validFrom: Date,
  validTo: Date,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

distributorProductPriceSchema.index({
  tenantId: 1,
  distributorId: 1,
  productId: 1,
  retailerCategory: 1
});

module.exports = mongoose.model('DistributorProductPrice', distributorProductPriceSchema, 'distributor_product_prices');
