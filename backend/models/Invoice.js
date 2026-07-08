const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  orderId: { type: String, required: true },
  invoiceNumber: { type: String, unique: true, required: true },
  retailerId: String,
  distributorId: String,
  amountDue: Number,
  amountPaid: { type: Number, default: 0 },
  dueDate: Date,
  status: { type: String, enum: ['draft', 'issued', 'paid', 'overdue', 'cancelled'], default: 'draft' },
  pdfUrl: String,
  notes: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

invoiceSchema.index({ companyId: 1, invoiceNumber: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
