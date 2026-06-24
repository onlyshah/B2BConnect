const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  companyId: { type: String, required: true },
  name: String,
  adType: { type: String, enum: ['banner', 'featured', 'sponsored', 'story'] },
  mediaUrl: { type: String, required: true },
  targeting: {
    regions: [String],
    retailerCategories: [String],
    minAge: Number,
    maxAge: Number
  },
  budget: Number,
  spent: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['draft', 'active', 'paused', 'ended'], default: 'draft' },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: Number,
    conversionRate: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

advertisementSchema.index({ tenantId: 1, companyId: 1, status: 1 });

module.exports = mongoose.model('Advertisement', advertisementSchema);
