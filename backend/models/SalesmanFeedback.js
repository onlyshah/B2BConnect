const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const salesmanFeedbackSchema = new mongoose.Schema({
  ...tenantFields(true),
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  feedbackType: { type: String, default: 'general', index: true },
  feedbackText: { type: String, required: true }
}, schemaOptions);

salesmanFeedbackSchema.index({ companyId: 1, salesmanId: 1, retailerId: 1, createdAt: -1 });

module.exports = mongoose.model('SalesmanFeedback', salesmanFeedbackSchema);
