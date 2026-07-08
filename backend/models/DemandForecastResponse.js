const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const demandForecastResponseSchema = new mongoose.Schema({
  ...tenantFields(true),
  productLaunchId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductLaunch', required: true, index: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  submittedBySalesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', default: null },
  interested: { type: Boolean, default: false },
  expectedMonthlyQty: { type: Number, default: 0, min: 0 },
  region: { type: String, default: '' }
}, schemaOptions);

demandForecastResponseSchema.index({ companyId: 1, productLaunchId: 1, retailerId: 1 }, { unique: true });

module.exports = mongoose.model('DemandForecastResponse', demandForecastResponseSchema);
