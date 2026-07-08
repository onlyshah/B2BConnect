const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const salesmanCompetitorReportSchema = new mongoose.Schema({
  ...tenantFields(true),
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  competitorBrand: { type: String, required: true },
  competitorPrice: { type: Number, default: 0, min: 0 },
  notes: { type: String, default: '' }
}, schemaOptions);

salesmanCompetitorReportSchema.index({ companyId: 1, salesmanId: 1, createdAt: -1 });

module.exports = mongoose.model('SalesmanCompetitorReport', salesmanCompetitorReportSchema);
