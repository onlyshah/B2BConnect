const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  industry: { type: String, required: true },
  subscriptionPlan: { type: String, default: 'starter' },
  territoryRules: [Object],
  approvalRules: Object,
  modules: {
    salesmanModule: {
      enabled: { type: Boolean, default: false },
      salesmenCount: { type: Number, default: 0 },
      dailyVisitTarget: { type: Number, default: 20 }
    }
  },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

companySchema.index({ tenantId: 1, name: 1 });

module.exports = mongoose.model('Company', companySchema);
