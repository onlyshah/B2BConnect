const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const salesmanRetailerScoreSchema = new mongoose.Schema({
  ...tenantFields(true),
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  totalScore: { type: Number, default: 0, min: 0, max: 100 },
  factors: { type: mongoose.Schema.Types.Mixed, default: {} }
}, schemaOptions);

salesmanRetailerScoreSchema.index({ companyId: 1, salesmanId: 1, retailerId: 1 }, { unique: true });

module.exports = mongoose.model('SalesmanRetailerScore', salesmanRetailerScoreSchema);
