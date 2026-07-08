const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
      // User's tenant context
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    // Denormalized data for quick access
    roleName: String,
    roleScope: String,
    permissions: [
      {
        name: String,
        module: String,
        action: String,
      },
    ],
    // Conditional permissions (for future)
    // e.g., can only approve orders under a certain amount
    conditionalPermissions: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map(),
    },
    // Role assignment details
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date, // For temporary role assignments
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'revoked'],
      default: 'active',
      index: true,
    },
    reason: String, // For revocation reason
    revokedAt: Date,
    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { collection: 'user_roles' }
);

// Ensure one role per user per tenant (no duplicate assignments)
userRoleSchema.index({ userId: 1, companyId: 1, status: 1 }, { unique: false });
userRoleSchema.index({ companyId: 1, status: 1 });
userRoleSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('UserRole', userRoleSchema);
