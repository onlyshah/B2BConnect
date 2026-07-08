const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const salesmanIncentiveSchema = new mongoose.Schema({
  ...tenantFields(true),
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  totalIncentive: { type: Number, default: 0, min: 0 },
  payoutStatus: { type: String, enum: ['pending', 'approved', 'paid', 'rejected'], default: 'pending', index: true }
}, schemaOptions);

salesmanIncentiveSchema.index({ companyId: 1, salesmanId: 1, payoutStatus: 1 });

module.exports = mongoose.model('SalesmanIncentive', salesmanIncentiveSchema);
