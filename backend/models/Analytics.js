const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  entityType: { type: String, enum: ['product', 'company', 'distributor', 'retailer', 'campaign', 'story', 'ad'] },
  entityId: { type: String, required: true },
  metricType: String,
  value: mongoose.Mixed,
  timeBucket: { type: String, enum: ['hourly', 'daily', 'weekly', 'monthly'] },
  date: { type: Date, required: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

analyticsSchema.index({ companyId: 1, entityType: 1, entityId: 1, date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
