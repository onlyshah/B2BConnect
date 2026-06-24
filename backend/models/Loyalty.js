const mongoose = require('mongoose');

const loyaltySchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  retailerId: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  tier: { type: String, enum: ['silver', 'gold', 'platinum'], default: 'silver' },
  activityLog: [{
    action: String,
    pointsEarned: Number,
    date: { type: Date, default: Date.now }
  }],
  redeemHistory: [{
    amount: Number,
    pointsUsed: Number,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

loyaltySchema.index({ tenantId: 1, retailerId: 1 });

module.exports = mongoose.model('Loyalty', loyaltySchema);
