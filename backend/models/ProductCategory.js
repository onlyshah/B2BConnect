const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const productCategorySchema = new mongoose.Schema({
  ...tenantFields(true),
  categoryName: { type: String, required: true, trim: true },
  parentCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', default: null },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, schemaOptions);

productCategorySchema.index({ companyId: 1, categoryName: 1 }, { unique: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);
