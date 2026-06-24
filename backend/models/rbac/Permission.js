const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      // Format: module.action (e.g., product.create, order.approve)
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
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'dashboard',
        'products',
        'campaigns',
        'salesforce',
        'inventory',
        'orders',
        'collections',
        'payments',
        'analytics',
        'users',
        'settings',
      ],
      default: 'products',
    },
    // Applicability
    applicableTo: {
      type: [String],
      enum: ['company', 'distributor', 'salesman', 'retailer', 'super_admin'],
      default: ['company', 'distributor', 'salesman', 'retailer'],
    },
    // UI relevance
    displayLabel: String,
    icon: String,
    priority: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'permissions' }
);

// Compound index for faster queries
permissionSchema.index({ module: 1, action: 1 });
permissionSchema.index({ applicableTo: 1 });

module.exports = mongoose.model('Permission', permissionSchema);
