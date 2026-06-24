const Role = require('../models/rbac/Role');
const Permission = require('../models/rbac/Permission');

/**
 * Define default system roles
 */
const DEFAULT_ROLES = [
  // SUPER ADMIN ROLE
  {
    name: 'Super Admin',
    roleType: 'system',
    scope: 'platform',
    description:
      'Platform administrator with full access to all features and configuration',
    permissions: [
      'product.create',
      'product.view',
      'product.update',
      'product.delete',
      'product.publish',
      'campaign.create',
      'campaign.view',
      'campaign.update',
      'campaign.publish',
      'order.create',
      'order.view',
      'order.update',
      'order.approve',
      'order.dispatch',
      'order.cancel',
      'inventory.view',
      'inventory.update',
      'inventory.manage',
      'collection.create',
      'collection.view',
      'collection.update',
      'visit.create',
      'visit.view',
      'salesman.assign',
      'salesman.manage',
      'retailer.view',
      'retailer.approve',
      'retailer.update',
      'analytics.view',
      'analytics.export',
      'settings.manage',
      'user.create',
      'user.view',
      'role.create',
      'role.manage',
      'sample.request',
      'sample.approve',
      'invoice.view',
      'invoice.download',
      'audit.view',
    ],
    isEditable: false,
    isDeletable: false,
  },

  // COMPANY ROLES
  {
    name: 'Company Admin',
    roleType: 'system',
    scope: 'company',
    description: 'Company administrator with full access to company resources',
    permissions: [
      'product.create',
      'product.view',
      'product.update',
      'product.delete',
      'product.publish',
      'campaign.create',
      'campaign.view',
      'campaign.update',
      'campaign.publish',
      'order.view',
      'order.approve',
      'salesman.assign',
      'salesman.manage',
      'retailer.view',
      'retailer.approve',
      'analytics.view',
      'analytics.export',
      'settings.manage',
      'user.create',
      'user.view',
      'role.create',
      'role.manage',
      'sample.approve',
      'invoice.view',
      'audit.view',
    ],
    isEditable: false,
    isDeletable: false,
  },
  {
    name: 'Company Sales Manager',
    roleType: 'system',
    scope: 'company',
    description: 'Manages sales operations and salesman performance',
    permissions: [
      'product.view',
      'order.view',
      'order.approve',
      'salesman.assign',
      'salesman.manage',
      'retailer.view',
      'retailer.approve',
      'analytics.view',
      'visit.view',
      'sample.approve',
      'invoice.view',
    ],
    isEditable: true,
    isDeletable: true,
  },
  {
    name: 'Company Marketing Manager',
    roleType: 'system',
    scope: 'company',
    description: 'Manages marketing campaigns and product promotions',
    permissions: [
      'product.view',
      'product.update',
      'product.publish',
      'campaign.create',
      'campaign.view',
      'campaign.update',
      'campaign.publish',
      'analytics.view',
      'sample.approve',
    ],
    isEditable: true,
    isDeletable: true,
  },
  {
    name: 'Company Finance Manager',
    roleType: 'system',
    scope: 'company',
    description: 'Manages financial operations and analytics',
    permissions: [
      'order.view',
      'collection.view',
      'analytics.view',
      'analytics.export',
      'invoice.view',
      'invoice.download',
      'audit.view',
    ],
    isEditable: true,
    isDeletable: true,
  },

  // DISTRIBUTOR ROLES
  {
    name: 'Distributor Admin',
    roleType: 'system',
    scope: 'distributor',
    description: 'Distributor administrator with full access',
    permissions: [
      'product.view',
      'order.view',
      'order.update',
      'order.approve',
      'order.dispatch',
      'inventory.view',
      'inventory.update',
      'inventory.manage',
      'collection.create',
      'collection.view',
      'collection.update',
      'visit.view',
      'salesman.assign',
      'retailer.view',
      'retailer.approve',
      'retailer.update',
      'analytics.view',
      'analytics.export',
      'settings.manage',
      'user.create',
      'user.view',
      'role.create',
      'role.manage',
      'sample.approve',
      'invoice.view',
      'invoice.download',
      'audit.view',
    ],
    isEditable: false,
    isDeletable: false,
  },
  {
    name: 'Distributor Manager',
    roleType: 'system',
    scope: 'distributor',
    description: 'Manages distributors operations and inventory',
    permissions: [
      'product.view',
      'order.view',
      'order.update',
      'order.approve',
      'order.dispatch',
      'inventory.view',
      'inventory.update',
      'inventory.manage',
      'collection.create',
      'collection.view',
      'collection.update',
      'retailer.view',
      'retailer.update',
      'analytics.view',
      'invoice.view',
    ],
    isEditable: true,
    isDeletable: true,
  },
  {
    name: 'Distributor Accountant',
    roleType: 'system',
    scope: 'distributor',
    description: 'Manages financial records and collections',
    permissions: [
      'order.view',
      'collection.view',
      'collection.update',
      'analytics.view',
      'invoice.view',
      'invoice.download',
    ],
    isEditable: true,
    isDeletable: true,
  },
  {
    name: 'Warehouse Staff',
    roleType: 'system',
    scope: 'distributor',
    description: 'Manages inventory and warehouse operations',
    permissions: [
      'product.view',
      'inventory.view',
      'inventory.update',
      'inventory.manage',
      'order.view',
    ],
    isEditable: true,
    isDeletable: true,
  },
  {
    name: 'Delivery Coordinator',
    roleType: 'system',
    scope: 'distributor',
    description: 'Coordinates product delivery to retailers',
    permissions: [
      'order.view',
      'order.dispatch',
      'inventory.view',
      'retailer.view',
    ],
    isEditable: true,
    isDeletable: true,
  },

  // SALESMAN ROLES
  {
    name: 'Sales Executive',
    roleType: 'system',
    scope: 'salesman',
    description: 'Field sales representative',
    permissions: [
      'product.view',
      'order.create',
      'order.view',
      'order.cancel',
      'visit.create',
      'visit.view',
      'retailer.view',
      'retailer.update',
      'collection.create',
      'collection.view',
      'analytics.view',
      'sample.request',
      'invoice.view',
    ],
    isEditable: false,
    isDeletable: false,
  },
  {
    name: 'Senior Sales Executive',
    roleType: 'system',
    scope: 'salesman',
    description: 'Senior field sales representative with approval rights',
    permissions: [
      'product.view',
      'order.create',
      'order.view',
      'order.cancel',
      'visit.create',
      'visit.view',
      'retailer.view',
      'retailer.update',
      'collection.create',
      'collection.view',
      'analytics.view',
      'sample.request',
      'invoice.view',
    ],
    isEditable: false,
    isDeletable: false,
  },

  // RETAILER ROLES
  {
    name: 'Retailer Owner',
    roleType: 'system',
    scope: 'retailer',
    description: 'Retail store owner with full access',
    permissions: [
      'product.view',
      'order.create',
      'order.view',
      'order.cancel',
      'retailer.view',
      'retailer.update',
      'analytics.view',
      'sample.request',
      'invoice.view',
      'invoice.download',
      'settings.manage',
      'user.create',
      'user.view',
    ],
    isEditable: false,
    isDeletable: false,
  },
  {
    name: 'Retailer Manager',
    roleType: 'system',
    scope: 'retailer',
    description: 'Retail store manager',
    permissions: [
      'product.view',
      'order.create',
      'order.view',
      'order.cancel',
      'retailer.view',
      'analytics.view',
      'sample.request',
      'invoice.view',
    ],
    isEditable: true,
    isDeletable: true,
  },
  {
    name: 'Retailer Staff',
    roleType: 'system',
    scope: 'retailer',
    description: 'Retail store staff member',
    permissions: [
      'product.view',
      'order.view',
      'sample.request',
      'invoice.view',
    ],
    isEditable: true,
    isDeletable: true,
  },
];

/**
 * Seed default roles to database
 */
async function seedDefaultRoles() {
  try {
    // Check if roles already exist
    const count = await Role.countDocuments({ roleType: 'system' });
    if (count > 0) {
      console.log('✓ Default system roles already seeded');
      return DEFAULT_ROLES; // Return the roles array even if not newly created
    }

    for (const roleData of DEFAULT_ROLES) {
      // Get permission objects
      const permissions = [];
      for (const permName of roleData.permissions) {
        const perm = await Permission.findOne({ name: permName });
        if (perm) {
          permissions.push({
            permissionId: perm._id,
            name: perm.name,
            module: perm.module,
            action: perm.action,
          });
        }
      }

      // Create role
      const role = new Role({
        name: roleData.name,
        roleType: roleData.roleType,
        scope: roleData.scope,
        description: roleData.description,
        permissions,
        permissionCount: permissions.length,
        isEditable: roleData.isEditable,
        isDeletable: roleData.isDeletable,
      });

      await role.save();
    }

    console.log(`✓ Seeded ${DEFAULT_ROLES.length} default system roles`);
    return DEFAULT_ROLES;
  } catch (error) {
    console.error('Error seeding default roles:', error);
    throw error;
  }
}

/**
 * Get role by name
 */
async function getRoleByName(name, tenantId = null) {
  const query = { name };
  if (tenantId) {
    query.tenantId = tenantId;
  }
  return Role.findOne(query).populate('permissions.permissionId');
}

/**
 * Get roles by scope
 */
async function getRolesByScope(scope, tenantId = null) {
  const query = { scope };
  if (tenantId) {
    query.tenantId = tenantId;
  }
  return Role.find(query).populate('permissions.permissionId');
}

/**
 * Create custom role for company/distributor
 */
async function createCustomRole(roleData, tenantId) {
  try {
    // Get permission objects
    const permissions = [];
    for (const permId of roleData.permissionIds || []) {
      const perm = await Permission.findById(permId);
      if (perm) {
        permissions.push({
          permissionId: perm._id,
          name: perm.name,
          module: perm.module,
          action: perm.action,
        });
      }
    }

    const role = new Role({
      name: roleData.name,
      roleType: 'custom',
      scope: roleData.scope,
      tenantId,
      description: roleData.description,
      permissions,
      permissionCount: permissions.length,
      isEditable: true,
      isDeletable: true,
      createdBy: roleData.createdBy,
    });

    await role.save();
    return role;
  } catch (error) {
    console.error('Error creating custom role:', error);
    throw error;
  }
}

module.exports = {
  DEFAULT_ROLES,
  seedDefaultRoles,
  getRoleByName,
  getRolesByScope,
  createCustomRole,
};
