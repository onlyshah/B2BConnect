const mongoose = require('mongoose');

const retailerApplicationSchema = new mongoose.Schema({
  registrationRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RegistrationRequest', required: true },
  storeName: { type: String, required: true },
  ownerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true, index: true },
  gstin: String,
  address: { type: String, required: true },
  state: { type: String, required: true, index: true },
  city: { type: String, required: true, index: true },
  pincode: { type: String, required: true },
  storeCategory: {
    type: String,
    enum: ['kirana', 'super-market', 'medical', 'cosmetics', 'general-store', 'specialty', 'other'],
    required: true
  },
  passwordHash: { type: String, required: true },
  selectedDistributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor' },
  selectedDistributorName: String,
  geoLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending-distributor-approval', 'approved', 'rejected'],
    default: 'pending-distributor-approval',
    index: true
  },
  approvalHistory: [{
    status: String,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

retailerApplicationSchema.index({ 'geoLocation': '2dsphere' });
retailerApplicationSchema.index({ email: 1, pincode: 1 });

module.exports = mongoose.model('RetailerApplication', retailerApplicationSchema);
