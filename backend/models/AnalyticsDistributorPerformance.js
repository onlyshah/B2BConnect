const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const analyticsDistributorPerformanceSchema = new mongoose.Schema({
  ...tenantFields(true),
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', required: true, index: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  fulfillmentRate: { type: Number, default: 0, min: 0, max: 100 },
  overallScore: { type: Number, default: 0, min: 0, max: 100 },
  orderCount: { type: Number, default: 0, min: 0 },
  revenue: { type: Number, default: 0, min: 0 }
}, schemaOptions);

analyticsDistributorPerformanceSchema.index({ companyId: 1, distributorId: 1, periodStart: -1 });

module.exports = mongoose.model('AnalyticsDistributorPerformance', analyticsDistributorPerformanceSchema);
