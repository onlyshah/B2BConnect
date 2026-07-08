const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const distributorOrderSchema = new mongoose.Schema({
  ...tenantFields(true),
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', required: true, index: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }
  }],
  grandTotal: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  }
}, schemaOptions);

distributorOrderSchema.index({ companyId: 1, distributorId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('DistributorOrder', distributorOrderSchema);
