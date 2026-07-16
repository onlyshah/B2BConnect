const mongoose = require('mongoose');
const { normalizeTenantAlias } = require('./schemaHelpers');

const paymentSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  invoiceId: { type: String, required: true, index: true },
  orderId: String,
  retailerId: String,
  distributorId: String,
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'upi', 'bank-transfer', 'cheque', 'card', 'adjustment'], required: true },
  referenceNumber: String,
  paidAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['recorded', 'reconciled', 'failed', 'reversed'], default: 'recorded' },
  notes: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

normalizeTenantAlias(paymentSchema);
paymentSchema.index({ companyId: 1, invoiceId: 1, paidAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema, 'payments');
