const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      // Examples: 'Admin', 'Sales Manager', 'Warehouse Staff', 'Owner'
    },
    roleType: {
      type: String,
      required: true,
      enum: [
        'system', // Fixed roles like super-admin, company-admin, distributor-admin
        'custom', // Custom roles created by company admins
      ],
      default: 'custom',
    },
    scope: {
      type: String,
      required: true,
      enum: [
        'platform', // Super Admin roles
        'company', // Company-level roles
        'distributor', // Distributor-level roles
        'salesman', // Salesman-level roles
        'retailer', // Retailer-level roles
      ],
      index: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      index: true,
      // For company, distributor scoped roles
      // null for platform roles
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      index: true,
      default: null,
    },
    parentTenantId: {
      type: mongoose.Schema.Types.ObjectId,
      // For super admin managing tenant roles
    },
    description: String,
    permissions: [
      {
        permissionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Permission',
        },
        // Denormalized for quick access
        name: String,
        module: String,
        action: String,
      },
    ],
    permissionCount: {
      type: Number,
      default: 0,
    },
    // Role hierarchy (for future)
    inheritsFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    // Metadata
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isEditable: {
      type: Boolean,
      default: true,
      // System roles can be modified but not deleted
    },
    isDeletable: {
      type: Boolean,
      default: true,
      // Some roles cannot be deleted (super-admin)
    },
    // Track creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
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
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { collection: 'roles' }
);

// Indexes for common queries
roleSchema.index({ companyId: 1, scope: 1 });
roleSchema.index({ roleType: 1, isActive: 1 });
roleSchema.index({ name: 1, companyId: 1 });

module.exports = mongoose.model('Role', roleSchema);
