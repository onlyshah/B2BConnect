const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  retailerId: { type: String, required: true },
  distributorId: String,
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['requested', 'approved', 'rejected', 'delivered'], default: 'requested' },
  approvalNotes: String,
  requestedAt: { type: Date, default: Date.now },
  approvedAt: Date,
  deliveredAt: Date,
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

sampleSchema.index({ companyId: 1, retailerId: 1, status: 1 });

module.exports = mongoose.model('Sample', sampleSchema, 'sample_requests');
