const mongoose = require('mongoose');

const registrationRequestSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['company', 'distributor', 'salesman', 'retailer'], 
    required: true,
    index: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    index: true 
  },
  phone: { 
    type: String, 
    required: true,
    index: true 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'email-verified', 'phone-verified'],
    default: 'pending',
    index: true
  },
  approvalStatus: {
    type: String,
    enum: ['pending-approval', 'approved', 'rejected'],
    default: 'pending-approval'
  },
  approvalNotes: String,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  phoneVerificationOtp: String,
  phoneVerificationExpiry: Date,
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RegistrationRequest', registrationRequestSchema);
