const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const campaignSchema = new mongoose.Schema({
  ...tenantFields(true),
  campaignName: { type: String, required: true, trim: true },
  linkedAdIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement' }],
  linkedSchemeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'archived'],
    default: 'draft',
    index: true
  },
  budget: { type: Number, default: 0, min: 0 },
  totalImpressions: { type: Number, default: 0 },
  totalClicks: { type: Number, default: 0 },
  totalConversions: { type: Number, default: 0 }
}, schemaOptions);

campaignSchema.index({ companyId: 1, status: 1, startDate: -1 });

module.exports = mongoose.model('Campaign', campaignSchema);
