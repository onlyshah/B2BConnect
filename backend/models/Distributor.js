const mongoose = require('mongoose');

const distributorSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  companyId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  regions: [String],
  pricingRules: Object,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

distributorSchema.index({ tenantId: 1, companyId: 1 });

module.exports = mongoose.model('Distributor', distributorSchema);
