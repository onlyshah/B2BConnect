const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const retailerCategorySchema = new mongoose.Schema({
  ...tenantFields(true),
  categoryName: { type: String, required: true, trim: true },
  defaultDiscountPercent: { type: Number, default: 0, min: 0, max: 100 },
  defaultCreditLimit: { type: Number, default: 0, min: 0 },
  defaultCreditDays: { type: Number, default: 0, min: 0 },
  loyaltyPointMultiplier: { type: Number, default: 1, min: 0 }
}, schemaOptions);

retailerCategorySchema.index({ companyId: 1, categoryName: 1 }, { unique: true });

module.exports = mongoose.model('RetailerCategory', retailerCategorySchema);
