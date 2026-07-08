const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.Mixed, default: null },
  name: { type: String, required: true, trim: true },
  legalName: { type: String, trim: true },
  industry: { type: String, trim: true },
  industryType: { type: String, trim: true },
  businessType: { type: String, trim: true },
  yearEstablished: { type: String, trim: true },
  website: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  supportContact: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, default: 'India' },
  pincode: { type: String, trim: true },
  description: { type: String, trim: true },
  gstin: { type: String, trim: true },
  gstNumber: { type: String, trim: true },
  pan: { type: String, trim: true },
  panNumber: { type: String, trim: true },
  cin: { type: String, trim: true },
  subscriptionPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', default: null, index: true },
  subscriptionPlan: { type: String, default: 'starter' },
  salesmanModuleEnabled: { type: Boolean, default: false },
  featureFlags: { type: Object, default: {} },
  registrationType: { type: String, trim: true },
  companyType: { type: String, trim: true },
  territoryRules: [Object],
  approvalRules: Object,
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: '__v' });

companySchema.pre('validate', function (next) {
  if (!this.industryType && this.industry) {
    this.industryType = this.industry;
  }
  next();
});

companySchema.index({ name: 1 });

module.exports = mongoose.model('Company', companySchema);
