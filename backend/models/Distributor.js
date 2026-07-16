const mongoose = require('mongoose');
const { normalizeTenantAlias } = require('./schemaHelpers');

const distributorSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  tenantId: { type: mongoose.Schema.Types.Mixed, default: null },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, trim: true },
  gstNumber: { type: String, trim: true },
  regions: [String],
  pricingRules: Object,
  status: { type: String, enum: ['active', 'inactive', 'pending', 'approved'], default: 'active' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: '__v' });

normalizeTenantAlias(distributorSchema);
distributorSchema.index({ companyId: 1, name: 1 });

module.exports = mongoose.model('Distributor', distributorSchema);
