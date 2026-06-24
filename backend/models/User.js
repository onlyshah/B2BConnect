const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super-admin', 'company-admin', 'distributor-admin', 'retailer', 'salesman'], required: true },
  companyId: String,
  distributorId: String,
  retailerId: String,
  salesmanId: String,
  refreshTokenVersion: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'inactive', 'rejected'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ tenantId: 1, email: 1 });

module.exports = mongoose.model('User', userSchema);
