const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const billingInvoiceSchema = new mongoose.Schema({
  ...tenantFields(true),
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true, index: true },
  invoiceNumber: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['draft', 'issued', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
    index: true
  },
  dueDate: { type: Date, default: null },
  paidAt: { type: Date, default: null },
  notes: { type: String, default: '' }
}, schemaOptions);

billingInvoiceSchema.index({ companyId: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('BillingInvoice', billingInvoiceSchema);
