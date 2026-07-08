const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const loyaltyTransactionSchema = new mongoose.Schema({
  ...tenantFields(true),
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  points: { type: Number, required: true },
  sourceAction: {
    type: String,
    enum: ['order_placed', 'video_watched', 'review_submitted', 'referral'],
    required: true,
    index: true
  },
  referenceId: { type: mongoose.Schema.Types.ObjectId, default: null },
  notes: { type: String, default: '' }
}, schemaOptions);

loyaltyTransactionSchema.index({ companyId: 1, retailerId: 1, sourceAction: 1 });

module.exports = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
