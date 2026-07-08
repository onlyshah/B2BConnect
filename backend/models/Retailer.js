const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  tenantId: { type: mongoose.Schema.Types.Mixed, default: null },
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', required: true, index: true },
  name: { type: String, required: true, trim: true },
  storeName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  gstin: { type: String, trim: true },
  gstNumber: { type: String, trim: true },
  location: {
    address: String,
    city: String,
    state: String,
    postalCode: String
  },
  category: { type: String, enum: ['silver', 'gold', 'platinum'], default: 'silver' },
  status: { type: String, enum: ['active', 'pending', 'inactive', 'rejected'], default: 'pending' },
  approvalNotes: String,
  loyaltyPoints: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: '__v' });

retailerSchema.index({ companyId: 1, distributorId: 1 });

module.exports = mongoose.model('Retailer', retailerSchema);
