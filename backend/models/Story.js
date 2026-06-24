const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  companyId: { type: String, required: true },
  type: { type: String, enum: ['story', 'short', 'banner', 'reel'] },
  title: String,
  contentUrl: { type: String, required: true },
  thumbnailUrl: String,
  cta: {
    text: String,
    action: String,
    actionData: Object
  },
  targetAudience: [String],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  viewCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  orderConversions: { type: Number, default: 0 },
  publishedAt: Date,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

storySchema.index({ tenantId: 1, companyId: 1, status: 1 });

module.exports = mongoose.model('Story', storySchema);
