const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const productMediaSchema = new mongoose.Schema({
  ...tenantFields(true),
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'pdf_brochure', 'demo_video', 'training_video'],
    required: true
  },
  url: { type: String, required: true },
  durationSeconds: { type: Number, default: 0, min: 0 },
  displayOrder: { type: Number, default: 0, min: 0 }
}, schemaOptions);

productMediaSchema.index({ companyId: 1, productId: 1, displayOrder: 1 });

module.exports = mongoose.model('ProductMedia', productMediaSchema);
