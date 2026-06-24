const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  companyId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['buy-and-get', 'discount', 'tiered', 'combo'] },
  description: String,
  conditions: Object,
  benefits: Object,
  validFrom: Date,
  validTo: Date,
  targetSegments: [String],
  minOrderValue: Number,
  maxDiscountPercentage: Number,
  status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

schemeSchema.index({ tenantId: 1, companyId: 1, status: 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
