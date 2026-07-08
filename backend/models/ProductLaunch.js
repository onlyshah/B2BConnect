const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const productLaunchSchema = new mongoose.Schema({
  ...tenantFields(true),
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  launchTitle: { type: String, required: true, trim: true },
  launchVideoUrl: { type: String, default: '' },
  launchDate: { type: Date, required: true, index: true },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed'],
    default: 'upcoming',
    index: true
  },
  totalInterestedCount: { type: Number, default: 0, min: 0 },
  totalPreBookedQty: { type: Number, default: 0, min: 0 }
}, schemaOptions);

productLaunchSchema.index({ companyId: 1, status: 1, launchDate: -1 });

module.exports = mongoose.model('ProductLaunch', productLaunchSchema);
