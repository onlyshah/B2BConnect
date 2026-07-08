const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const salesmanPerformanceSchema = new mongoose.Schema({
  ...tenantFields(true),
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  periodStart: { type: Date, required: true, index: true },
  periodEnd: { type: Date, required: true },
  overallScore: { type: Number, default: 0, min: 0, max: 100 },
  totalVisits: { type: Number, default: 0, min: 0 },
  totalOrders: { type: Number, default: 0, min: 0 },
  totalRevenue: { type: Number, default: 0, min: 0 }
}, schemaOptions);

salesmanPerformanceSchema.index({ companyId: 1, salesmanId: 1, periodStart: -1 });

module.exports = mongoose.model('SalesmanPerformance', salesmanPerformanceSchema);
