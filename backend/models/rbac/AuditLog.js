const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: String,
    userRole: String,
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    // Permission being used
    permission: {
      type: String,
      required: true,
      // e.g., 'product.create'
      index: true,
    },
    module: {
      type: String,
      required: true,
      enum: [
        'product',
        'campaign',
        'salesman',
        'distributor',
        'retailer',
        'order',
        'inventory',
        'collection',
        'invoice',
        'sample',
        'payment',
        'analytics',
        'settings',
        'user',
        'role',
        'audit',
      ],
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'create',
        'view',
        'update',
        'delete',
        'approve',
        'reject',
        'publish',
        'unpublish',
        'assign',
        'manage',
        'download',
        'export',
        'clone',
        'send',
      ],
    },
    // What was affected
    entityType: {
      type: String,
      required: true,
      // e.g., 'Product', 'Order', 'Salesman'
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    entityName: String, // e.g., product name, order ID
    // Changes made
    oldValues: mongoose.Schema.Types.Mixed,
    newValues: mongoose.Schema.Types.Mixed,
    // Request context
    ipAddress: String,
    userAgent: String,
    method: String, // GET, POST, PUT, DELETE, PATCH
    endpoint: String,
    // Additional context
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
    errorMessage: String,
    reason: String, // Why the action was taken
    tags: [String], // For categorization
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { collection: 'audit_logs' }
);

// Indexes for common queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ tenantId: 1, timestamp: -1 });
auditLogSchema.index({ module: 1, action: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
