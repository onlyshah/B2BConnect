const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const salesmanAssignmentSchema = new mongoose.Schema({
  ...tenantFields(true),
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  isActive: { type: Boolean, default: true, index: true }
}, schemaOptions);

salesmanAssignmentSchema.index({ companyId: 1, salesmanId: 1, retailerId: 1 }, { unique: true });

module.exports = mongoose.model('SalesmanAssignment', salesmanAssignmentSchema);
