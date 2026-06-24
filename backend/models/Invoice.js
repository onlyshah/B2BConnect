const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

invoiceSchema.index({ tenantId: 1, invoiceNumber: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
