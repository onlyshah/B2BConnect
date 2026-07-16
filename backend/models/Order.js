const mongoose = require('mongoose');
const { normalizeTenantAlias } = require('./schemaHelpers');

const orderSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  distributorId: String,
  retailerId: String,
  orderType: { type: String, enum: ['retailer-order', 'distributor-replenishment'], required: true },
  items: [{
    productId: String,
    quantity: Number,
    unitPrice: Number,
    discount: Number
  }],
  subtotal: Number,
  tax: Number,
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'approved', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentTerms: String,
  invoiceId: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

normalizeTenantAlias(orderSchema);
orderSchema.index({ companyId: 1, retailerId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
