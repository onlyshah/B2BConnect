const mongoose = require('mongoose');

const salesmanApplicationSchema = new mongoose.Schema({
  registrationRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RegistrationRequest', required: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true, index: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true, index: true },
  city: { type: String, required: true, index: true },
  pincode: { type: String, required: true },
  experience: { type: Number, required: true }, // Years
  previousCompany: String,
  aadhaarNumber: { type: String, required: true },
  panNumber: { type: String, required: true },
  passwordHash: { type: String, required: true },
  cv: {
    filename: String,
    url: String,
    uploadedAt: Date
  },
  aadhaarDocument: {
    filename: String,
    url: String,
    uploadedAt: Date
  },
  panDocument: {
    filename: String,
    url: String,
    uploadedAt: Date
  },
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

module.exports = mongoose.model('SalesmanApplication', salesmanApplicationSchema);
