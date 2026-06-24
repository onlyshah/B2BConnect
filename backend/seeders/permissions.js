const Permission = require('../models/rbac/Permission');

/**
 * Predefined permissions for the platform
 */
const PERMISSIONS = [
  // PRODUCT PERMISSIONS
  {
    name: 'product.create',
    module: 'product',
    action: 'create',
    description: 'Create new products',
    category: 'products',
    applicableTo: ['company', 'super_admin'],
    displayLabel: 'Create Product',
    icon: 'add-circle',
    priority: 10,
  },
  {
    name: 'product.view',
    module: 'product',
    action: 'view',
    description: 'View product details',
    category: 'products',
    applicableTo: ['company', 'distributor', 'salesman', 'retailer', 'super_admin'],
    displayLabel: 'View Products',
    icon: 'eye',
    priority: 1,
  },
  {
    name: 'product.update',
    module: 'product',
    action: 'update',
    description: 'Update product details',
    category: 'products',
    applicableTo: ['company', 'super_admin'],
    displayLabel: 'Edit Product',
    icon: 'edit',
    priority: 9,
  },
  {
    name: 'product.delete',
    module: 'product',
    action: 'delete',
    description: 'Delete products',
    category: 'products',
    applicableTo: ['company', 'super_admin'],
    displayLabel: 'Delete Product',
    icon: 'trash',
    priority: 11,
  },
  {
    name: 'product.publish',
    module: 'product',
    action: 'publish',
    description: 'Publish products to marketplaces',
    category: 'products',
    applicableTo: ['company', 'super_admin'],
    displayLabel: 'Publish Product',
    icon: 'share-social',
    priority: 8,
  },

  // CAMPAIGN PERMISSIONS
  {
    name: 'campaign.create',
    module: 'campaign',
    action: 'create',
    description: 'Create marketing campaigns',
    category: 'campaigns',
    applicableTo: ['company', 'super_admin'],
    displayLabel: 'Create Campaign',
    icon: 'megaphone',
    priority: 10,
  },
  {
    name: 'campaign.view',
    module: 'campaign',
    action: 'view',
    description: 'View campaigns',
    category: 'campaigns',
    applicableTo: ['company', 'distributor', 'salesman', 'super_admin'],
    displayLabel: 'View Campaigns',
    icon: 'eye',
    priority: 1,
  },
  {
    name: 'campaign.update',
    module: 'campaign',
    action: 'update',
    description: 'Update campaigns',
    category: 'campaigns',
    applicableTo: ['company', 'super_admin'],
    displayLabel: 'Edit Campaign',
    icon: 'edit',
    priority: 9,
  },
  {
    name: 'campaign.publish',
    module: 'campaign',
    action: 'publish',
    description: 'Publish campaigns',
    category: 'campaigns',
    applicableTo: ['company', 'super_admin'],
    displayLabel: 'Publish Campaign',
    icon: 'share-social',
    priority: 8,
  },

  // ORDER PERMISSIONS
  {
    name: 'order.create',
    module: 'order',
    action: 'create',
    description: 'Create orders',
    category: 'orders',
    applicableTo: ['salesman', 'retailer', 'super_admin'],
    displayLabel: 'Create Order',
    icon: 'add-circle',
    priority: 10,
  },
  {
    name: 'order.view',
    module: 'order',
    action: 'view',
    description: 'View orders',
    category: 'orders',
    applicableTo: ['company', 'distributor', 'salesman', 'retailer', 'super_admin'],
    displayLabel: 'View Orders',
    icon: 'eye',
    priority: 1,
  },
  {
    name: 'order.update',
    module: 'order',
    action: 'update',
    description: 'Update order details',
    category: 'orders',
    applicableTo: ['distributor', 'super_admin'],
    displayLabel: 'Edit Order',
    icon: 'edit',
    priority: 9,
  },
  {
    name: 'order.approve',
    module: 'order',
    action: 'approve',
    description: 'Approve orders',
    category: 'orders',
    applicableTo: ['distributor', 'company', 'super_admin'],
    displayLabel: 'Approve Order',
    icon: 'checkmark-circle',
    priority: 9,
  },
  {
    name: 'order.dispatch',
    module: 'order',
    action: 'manage',
    description: 'Dispatch orders',
    category: 'orders',
    applicableTo: ['distributor', 'super_admin'],
    displayLabel: 'Dispatch Order',
    icon: 'send',
    priority: 8,
  },
  {
    name: 'order.cancel',
    module: 'order',
    action: 'delete',
    description: 'Cancel orders',
    category: 'orders',
    applicableTo: ['salesman', 'retailer', 'distributor', 'super_admin'],
    displayLabel: 'Cancel Order',
    icon: 'close-circle',
    priority: 7,
  },

  // INVENTORY PERMISSIONS
  {
    name: 'inventory.view',
    module: 'inventory',
    action: 'view',
    description: 'View inventory',
    category: 'inventory',
    applicableTo: ['distributor', 'salesman', 'super_admin'],
    displayLabel: 'View Inventory',
    icon: 'eye',
    priority: 1,
  },
  {
    name: 'inventory.update',
    module: 'inventory',
    action: 'update',
    description: 'Update inventory',
    category: 'inventory',
    applicableTo: ['distributor', 'super_admin'],
    displayLabel: 'Update Inventory',
    icon: 'edit',
    priority: 9,
  },
  {
    name: 'inventory.manage',
    module: 'inventory',
    action: 'manage',
    description: 'Manage inventory levels',
    category: 'inventory',
    applicableTo: ['distributor', 'super_admin'],
    displayLabel: 'Manage Inventory',
    icon: 'folder',
    priority: 9,
  },

  // COLLECTION PERMISSIONS
  {
    name: 'collection.create',
    module: 'collection',
    action: 'create',
    description: 'Record cash collections',
    category: 'orders',
    applicableTo: ['salesman', 'distributor', 'super_admin'],
    displayLabel: 'Record Collection',
    icon: 'add-circle',
    priority: 10,
  },
  {
    name: 'collection.view',
    module: 'collection',
    action: 'view',
    description: 'View collections',
    category: 'orders',
    applicableTo: ['distributor', 'salesman', 'super_admin'],
    displayLabel: 'View Collections',
    icon: 'eye',
    priority: 1,
  },
  {
    name: 'collection.update',
    module: 'collection',
    action: 'update',
    description: 'Update collection records',
    category: 'orders',
    applicableTo: ['distributor', 'super_admin'],
    displayLabel: 'Update Collection',
    icon: 'edit',
    priority: 9,
  },

  // VISIT PERMISSIONS
  {
    name: 'visit.create',
    module: 'salesman',
    action: 'create',
    description: 'Create retailer visits',
    category: 'salesforce',
    applicableTo: ['salesman', 'super_admin'],
    displayLabel: 'Create Visit',
    icon: 'add-circle',
    priority: 10,
  },
  {
    name: 'visit.view',
    module: 'salesman',
    action: 'view',
    description: 'View visits',
    category: 'salesforce',
    applicableTo: ['salesman', 'distributor', 'company', 'super_admin'],
    displayLabel: 'View Visits',
    icon: 'eye',
    priority: 1,
  },

  // SALESMAN PERMISSIONS
  {
    name: 'salesman.assign',
    module: 'salesman',
    action: 'assign',
    description: 'Assign salesmen to territories',
    category: 'salesforce',
    applicableTo: ['distributor', 'company', 'super_admin'],
    displayLabel: 'Assign Salesman',
    icon: 'person-add',
    priority: 9,
  },
  {
    name: 'salesman.manage',
    module: 'salesman',
    action: 'manage',
    description: 'Manage salesman details',
    category: 'salesforce',
    applicableTo: ['company', 'super_admin'],
    displayLabel: 'Manage Salesman',
    icon: 'folder',
    priority: 9,
  },

  // RETAILER PERMISSIONS
  {
    name: 'retailer.view',
    module: 'retailer',
    action: 'view',
    description: 'View retailers',
    category: 'salesforce',
    applicableTo: ['salesman', 'distributor', 'company', 'retailer', 'super_admin'],
    displayLabel: 'View Retailers',
    icon: 'eye',
    priority: 1,
  },
  {
    name: 'retailer.approve',
    module: 'retailer',
    action: 'approve',
    description: 'Approve retailers',
    category: 'salesforce',
    applicableTo: ['distributor', 'company', 'super_admin'],
    displayLabel: 'Approve Retailer',
    icon: 'checkmark-circle',
    priority: 9,
  },
  {
    name: 'retailer.update',
    module: 'retailer',
    action: 'update',
    description: 'Update retailer information',
    category: 'salesforce',
    applicableTo: ['retailer', 'distributor', 'company', 'super_admin'],
    displayLabel: 'Update Retailer',
    icon: 'edit',
    priority: 9,
  },

  // ANALYTICS PERMISSIONS
  {
    name: 'analytics.view',
    module: 'analytics',
    action: 'view',
    description: 'View analytics and reports',
    category: 'analytics',
    applicableTo: ['company', 'distributor', 'salesman', 'retailer', 'super_admin'],
    displayLabel: 'View Analytics',
    icon: 'bar-chart',
    priority: 1,
  },
  {
    name: 'analytics.export',
    module: 'analytics',
    action: 'export',
    description: 'Export analytics data',
    category: 'analytics',
    applicableTo: ['company', 'distributor', 'super_admin'],
    displayLabel: 'Export Analytics',
    icon: 'download',
    priority: 8,
  },

  // SETTINGS PERMISSIONS
  {
    name: 'settings.manage',
    module: 'settings',
    action: 'manage',
    description: 'Manage platform settings',
    category: 'settings',
    applicableTo: ['company', 'distributor', 'retailer', 'super_admin'],
    displayLabel: 'Manage Settings',
    icon: 'settings',
    priority: 9,
  },

  // USER & ROLE PERMISSIONS
  {
    name: 'user.create',
    module: 'user',
    action: 'create',
    description: 'Create new users',
    category: 'users',
    applicableTo: ['company', 'distributor', 'super_admin'],
    displayLabel: 'Create User',
    icon: 'person-add',
    priority: 10,
  },
  {
    name: 'user.view',
    module: 'user',
    action: 'view',
    description: 'View users',
    category: 'users',
    applicableTo: ['company', 'distributor', 'super_admin'],
    displayLabel: 'View Users',
    icon: 'eye',
    priority: 1,
  },
  {
    name: 'role.create',
    module: 'role',
    action: 'create',
    description: 'Create custom roles',
    category: 'users',
    applicableTo: ['company', 'distributor', 'super_admin'],
    displayLabel: 'Create Role',
    icon: 'add-circle',
    priority: 10,
  },
  {
    name: 'role.manage',
    module: 'role',
    action: 'manage',
    description: 'Manage roles and permissions',
    category: 'users',
    applicableTo: ['company', 'distributor', 'super_admin'],
    displayLabel: 'Manage Roles',
    icon: 'settings',
    priority: 10,
  },

  // SAMPLE & INVOICE PERMISSIONS
  {
    name: 'sample.request',
    module: 'sample',
    action: 'create',
    description: 'Request product samples',
    category: 'products',
    applicableTo: ['retailer', 'super_admin'],
    displayLabel: 'Request Sample',
    icon: 'add-circle',
    priority: 10,
  },
  {
    name: 'sample.approve',
    module: 'sample',
    action: 'approve',
    description: 'Approve sample requests',
    category: 'products',
    applicableTo: ['distributor', 'company', 'super_admin'],
    displayLabel: 'Approve Sample',
    icon: 'checkmark-circle',
    priority: 9,
  },
  {
    name: 'invoice.view',
    module: 'invoice',
    action: 'view',
    description: 'View invoices',
    category: 'orders',
    applicableTo: ['distributor', 'retailer', 'super_admin'],
    displayLabel: 'View Invoices',
    icon: 'eye',
    priority: 1,
  },
  {
    name: 'invoice.download',
    module: 'invoice',
    action: 'download',
    description: 'Download invoices',
    category: 'orders',
    applicableTo: ['distributor', 'retailer', 'super_admin'],
    displayLabel: 'Download Invoice',
    icon: 'download',
    priority: 8,
  },

  // AUDIT PERMISSIONS
  {
    name: 'audit.view',
    module: 'audit',
    action: 'view',
    description: 'View audit logs',
    category: 'settings',
    applicableTo: ['company', 'distributor', 'super_admin'],
    displayLabel: 'View Audit Logs',
    icon: 'eye',
    priority: 1,
  },
];

/**
 * Seed permissions to database
 */
async function seedPermissions() {
  try {
    // Check if permissions already exist
    const count = await Permission.countDocuments();
    if (count > 0) {
      console.log('✓ Permissions already seeded');
      return PERMISSIONS; // Return the permissions array even if not newly created
    }

    // Insert all permissions
    await Permission.insertMany(PERMISSIONS);
    console.log(`✓ Seeded ${PERMISSIONS.length} permissions`);
    return PERMISSIONS;
  } catch (error) {
    console.error('Error seeding permissions:', error);
    throw error;
  }
}

/**
 * Get permission by name
 */
async function getPermissionByName(name) {
  return Permission.findOne({ name });
}

/**
 * Get permissions by module
 */
async function getPermissionsByModule(module) {
  return Permission.find({ module });
}

/**
 * Get permissions applicable to role type
 */
async function getPermissionsByRoleType(roleType) {
  // roleType: 'company', 'distributor', 'salesman', 'retailer', 'super_admin'
  return Permission.find({ applicableTo: roleType });
}

module.exports = {
  PERMISSIONS,
  seedPermissions,
  getPermissionByName,
  getPermissionsByModule,
  getPermissionsByRoleType,
};
