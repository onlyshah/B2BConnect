const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  userId: String,
  action: { type: String, required: true },
  resourceType: String,
  resourceId: String,
  details: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});

auditLogSchema.index({ tenantId: 1, userId: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
