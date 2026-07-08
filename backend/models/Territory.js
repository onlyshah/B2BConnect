const mongoose = require('mongoose');

const territorySchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  name: String,
  location: {
    country: { type: String },
    city: { type: String },
    state: { type: String, required: true },
    regions: [String]
  },
  assignedDistributorId: { type: String },
  coverageRules: Object,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

territorySchema.index({ companyId: 1, 'location.state': 1, 'location.city': 1 });

module.exports = mongoose.model('Territory', territorySchema);
