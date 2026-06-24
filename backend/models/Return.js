const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  orderId: { type: String, required: true, index: true },
  retailerId: { type: String, required: true, index: true },
  distributorId: String,
  companyId: { type: String, required: true },
  items: [{
    productId: String,
    quantity: Number,
    reason: String,
    photos: [String]
  }],
  claimType: { type: String, enum: ['return', 'damage', 'shortage'], default: 'return' },
  status: { type: String, enum: ['submitted', 'under-review', 'approved', 'rejected', 'resolved'], default: 'submitted' },
  resolutionNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

returnSchema.index({ tenantId: 1, retailerId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Return', returnSchema, 'returns');
