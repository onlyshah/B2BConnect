const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  companyId: { type: String, required: true, index: true },
  distributorId: { type: String, required: true },
  name: { type: String, required: true },
  storeName: { type: String, required: true },
  gstin: String,
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

retailerSchema.index({ tenantId: 1, companyId: 1 });

module.exports = mongoose.model('Retailer', retailerSchema);
