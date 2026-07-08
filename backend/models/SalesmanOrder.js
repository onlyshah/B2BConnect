const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const salesmanOrderSchema = new mongoose.Schema({
  ...tenantFields(true),
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  status: { type: String, enum: ['linked', 'completed', 'cancelled'], default: 'linked', index: true },
  notes: { type: String, default: '' }
}, schemaOptions);

salesmanOrderSchema.index({ companyId: 1, salesmanId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model('SalesmanOrder', salesmanOrderSchema);
