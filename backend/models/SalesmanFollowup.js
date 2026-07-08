const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const salesmanFollowupSchema = new mongoose.Schema({
  ...tenantFields(true),
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  followUpDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ['open', 'completed', 'missed'], default: 'open', index: true },
  notes: { type: String, default: '' }
}, schemaOptions);

salesmanFollowupSchema.index({ companyId: 1, salesmanId: 1, status: 1, followUpDate: 1 });

module.exports = mongoose.model('SalesmanFollowup', salesmanFollowupSchema);
