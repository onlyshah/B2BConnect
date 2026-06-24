const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'partial', 'paid', 'overdue'], default: 'pending' },
  paidAt: Date
}, { _id: false });

const installmentPlanSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  invoiceId: { type: String, required: true, index: true },
  retailerId: { type: String, required: true, index: true },
  distributorId: String,
  totalAmount: { type: Number, required: true },
  creditDays: { type: Number, default: 0 },
  installments: [installmentSchema],
  status: { type: String, enum: ['active', 'completed', 'defaulted', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

installmentPlanSchema.index({ tenantId: 1, retailerId: 1, status: 1 });

module.exports = mongoose.model('InstallmentPlan', installmentPlanSchema, 'installment_plans');
