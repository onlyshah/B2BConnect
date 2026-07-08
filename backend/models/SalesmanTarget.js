const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const salesmanTargetSchema = new mongoose.Schema({
  ...tenantFields(true),
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  periodType: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true, index: true },
  targetVisits: { type: Number, default: 0, min: 0 },
  actualVisits: { type: Number, default: 0, min: 0 },
  targetOrders: { type: Number, default: 0, min: 0 },
  actualOrders: { type: Number, default: 0, min: 0 }
}, schemaOptions);

salesmanTargetSchema.index({ companyId: 1, salesmanId: 1, periodType: 1, createdAt: -1 });

module.exports = mongoose.model('SalesmanTarget', salesmanTargetSchema);
