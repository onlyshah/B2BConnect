const mongoose = require('mongoose');

const distributorApplicationSchema = new mongoose.Schema({
  registrationRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RegistrationRequest', required: true },
  businessName: { type: String, required: true },
  gstin: { type: String, required: true, unique: true, index: true },
  panNumber: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, index: true },
  address: { type: String, required: true },
  state: { type: String, required: true, index: true },
  city: { type: String, required: true, index: true },
  pincode: { type: String, required: true },
  warehouseCapacity: { type: Number, default: null },
  passwordHash: { type: String, required: true },
  appliedCompanies: [{
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    companyName: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedAt: Date,
    rejectedAt: Date,
    remarks: String
  }],
  overallStatus: {
    type: String,
    enum: ['pending-company-approval', 'approved', 'rejected'],
    default: 'pending-company-approval',
    index: true
  },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

distributorApplicationSchema.index({ email: 1, gstin: 1 });

module.exports = mongoose.model('DistributorApplication', distributorApplicationSchema);
