const mongoose = require('mongoose');

const territorySchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  companyId: { type: String, required: true },
  name: String,
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    regions: [String]
  },
  assignedDistributorId: { type: String, required: true },
  coverageRules: Object,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

territorySchema.index({ tenantId: 1, companyId: 1, 'location.state': 1, 'location.city': 1 });

module.exports = mongoose.model('Territory', territorySchema);
