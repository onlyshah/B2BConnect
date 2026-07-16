const mongoose = require('mongoose');
const { normalizeTenantAlias } = require('./schemaHelpers');

const userSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', index: true, default: null },
  tenantId: { type: mongoose.Schema.Types.Mixed, default: null },
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', default: null, index: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', default: null, index: true },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', default: null, index: true },
  name: { type: String, trim: true },
  fullName: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super-admin', 'company-admin', 'company-staff', 'distributor-admin', 'distributor-staff', 'retailer', 'salesman'], required: true },
  linkedEntityId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  linkedEntityType: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null },
  fcmTokens: [{ type: String }],
  refreshTokenVersion: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'inactive', 'rejected'], default: 'active' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: '__v' });

userSchema.pre('validate', function (next) {
  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }
  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }
  next();
});

normalizeTenantAlias(userSchema);
userSchema.index({ companyId: 1, role: 1 });
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);
