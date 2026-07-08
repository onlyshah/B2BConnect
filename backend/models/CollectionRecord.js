const mongoose = require('mongoose');

const collectionRecordSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  
  collectionId: { type: String, unique: true },
  retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true },
  distributor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', required: true },
  collectionDate: { type: Date, default: Date.now },
  
  amountCollected: { type: Number, required: true },
  paymentMode: { type: String, enum: ['cash', 'cheque', 'bank-transfer', 'digital'], required: true },
  referenceId: { type: String },
  
  balanceBefore: { type: Number },
  balanceAfter: { type: Number },
  
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  status: { type: String, enum: ['recorded', 'verified', 'reconciled'], default: 'recorded' },
  verificationDate: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

collectionRecordSchema.index({ companyId: 1, retailer: 1, collectionDate: -1 });
collectionRecordSchema.index({ distributor: 1, status: 1 });

module.exports = mongoose.model('CollectionRecord', collectionRecordSchema);
