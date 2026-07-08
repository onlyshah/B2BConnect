const { mongoose, schemaOptions } = require('./schemaHelpers');

const onboardingRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['company', 'distributor', 'retailer', 'salesman'],
    required: true,
    index: true
  },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null, index: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true, trim: true, index: true },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  geoLocation: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  gstin: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  documents: [{
    docType: { type: String, required: true },
    url: { type: String, required: true }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  reviewedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: '' }
}, schemaOptions);

onboardingRequestSchema.index({ type: 1, status: 1 });
onboardingRequestSchema.index({ email: 1 });
onboardingRequestSchema.index({ phone: 1 });
onboardingRequestSchema.index({ city: 1, state: 1 });

module.exports = mongoose.model('OnboardingRequest', onboardingRequestSchema);
