const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  productId: { type: String, required: true },
  retailerId: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  feedbackType: { type: String, enum: ['positive', 'negative', 'neutral'] },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reviewSchema.index({ tenantId: 1, productId: 1, retailerId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
