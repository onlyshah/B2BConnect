const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  
  salesman: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  distributor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', required: true },
  
  visitDate: { type: Date, required: true, index: true },
  checkInTime: { type: Date, required: true },
  checkOutTime: { type: Date },
  durationMinutes: { type: Number },
  
  geoLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  
  purpose: { type: String, enum: ['order-collection', 'product-demo', 'feedback', 'retailer-onboarding', 'stock-check', 'other'] },
  discussionNotes: { type: String },
  productsShown: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  visitOutcome: { type: String, enum: ['completed', 'pending', 'cancelled'] },
  orderGenerated: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  
  competitorProducts: [{
    brand: String,
    product: String,
    price: Number,
    feedback: String
  }],
  
  photos: [String],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

visitSchema.index({ tenantId: 1, salesman: 1, visitDate: -1 });
visitSchema.index({ retailer: 1, visitDate: -1 });
visitSchema.index({ 'geoLocation': '2dsphere' });

module.exports = mongoose.model('Visit', visitSchema);
