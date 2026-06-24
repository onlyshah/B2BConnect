const mongoose = require('mongoose');

const companyApplicationSchema = new mongoose.Schema({
  registrationRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RegistrationRequest', required: true },
  companyName: { type: String, required: true },
  businessType: { type: String, required: true },
  gstin: { type: String, required: true, unique: true, index: true },
  panNumber: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, index: true },
  website: String,
  address: { type: String, required: true },
  state: { type: String, required: true, index: true },
  city: { type: String, required: true, index: true },
  pincode: { type: String, required: true },
  passwordHash: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending-approval', 'approved', 'rejected'],
    default: 'pending-approval',
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

companyApplicationSchema.index({ email: 1, gstin: 1 });

module.exports = mongoose.model('CompanyApplication', companyApplicationSchema);
