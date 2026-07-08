const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  tenantId: { type: mongoose.Schema.Types.Mixed, default: null },
  name: { type: String, required: true, trim: true },
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
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: '__v' });

advertisementSchema.index({ companyId: 1, status: 1 });

module.exports = mongoose.model('Advertisement', advertisementSchema);
