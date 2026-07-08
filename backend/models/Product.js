const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  mrp: { type: Number, required: true },
  gst: { type: Number, required: true },
  packSize: String,
  weight: String,
  benefits: [String],
  ingredients: [String],
  specs: Object,
  media: [{ type: String, url: String, thumbnailUrl: String }],
  launchStatus: { type: String, enum: ['draft', 'live', 'archived'], default: 'draft' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.index({ tenantId: 1, companyId: 1, sku: 1 });

module.exports = mongoose.model('Product', productSchema);
