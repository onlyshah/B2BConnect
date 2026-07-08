const { mongoose, schemaOptions } = require('./schemaHelpers');

const subscriptionPlanSchema = new mongoose.Schema({
  planName: { type: String, required: true, trim: true },
  maxRetailers: { type: Number, default: 0, min: 0 },
  maxDistributors: { type: Number, default: 0, min: 0 },
  maxSalesmen: { type: Number, default: 0, min: 0 },
  priceMonthly: { type: Number, default: 0, min: 0 },
  features: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, schemaOptions);

subscriptionPlanSchema.index({ planName: 1 }, { unique: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
