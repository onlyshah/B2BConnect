const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../../middleware/auth');
const {
  getPermissions,
  getRoles,
  createRole,
  updateRole,
  addPermissionToRole,
  removePermissionFromRole,
  deleteRole,
  getUserPermissions,
  assignRoleToUser,
} = require('../../controllers/rbacController');

const router = express.Router();

// Permission endpoints
router.get('/permissions', authenticate, authorize(['super-admin']), getPermissions);

// Role endpoints
router.get('/roles', authenticate, authorize(['super-admin']), getRoles);

router.post('/roles', authenticate, authorize(['super-admin']), createRole);

router.put('/roles/:roleId', authenticate, authorize(['super-admin']), updateRole);

router.post('/roles/:roleId/permissions', authenticate, authorize(['super-admin']), addPermissionToRole);

router.delete('/roles/:roleId/permissions', authenticate, authorize(['super-admin']), removePermissionFromRole);

router.delete('/roles/:roleId', authenticate, authorize(['super-admin']), deleteRole);

// User role endpoints
router.get('/users/:userId/permissions', authenticate, ensureTenant, getUserPermissions);

router.post('/users/:userId/assign-role', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), assignRoleToUser);

module.exports = router;

/**
 * GET /api/rbac/roles
 * List roles for tenant
 */
router.get('/roles', requirePermission('role.manage'), async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || req.user.tenantId;
    const { roleType, scope } = req.query;

    const filter = {
      $or: [
        { scope: 'platform' }, // Platform roles
        { tenantId }, // Tenant-specific roles
      ],
    };

    if (roleType) filter.roleType = roleType;
    if (scope) filter.scope = scope;

    const roles = await Role.find(filter)
      .populate('permissions.permissionId', 'name module action description')
      .lean();

    res.json({ roles, count: roles.length });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

/**
 * GET /api/rbac/roles/:roleId
 * Get role details
 */
router.get('/roles/:roleId', requirePermission('role.manage'), async (req, res) => {
  try {
    const { roleId } = req.params;
    const role = await Role.findById(roleId)
      .populate('permissions.permissionId')
      .populate('createdBy', 'name email');

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json({ role });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

/**
 * POST /api/rbac/roles
 * Create custom role
 */
router.post('/roles', requirePermission('role.create'), async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || req.user.tenantId;
    const { name, description, scope, permissionIds } = req.body;

    // Validate required fields
    if (!name || !scope) {
      return res.status(400).json({ error: 'Name and scope are required' });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ name, tenantId });
    if (existingRole) {
      return res.status(400).json({ error: 'Role already exists' });
    }

    // Get permissions
    const permissions = [];
    if (permissionIds && Array.isArray(permissionIds)) {
      for (const permId of permissionIds) {
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
    }

    // Create role
    const role = new Role({
      name,
      description,
      scope,
      roleType: 'custom',
      tenantId,
      permissions,
      permissionCount: permissions.length,
      isEditable: true,
      isDeletable: true,
      createdBy: req.user.id,
    });

    await role.save();

    // Log audit event
    await logAuditEvent({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      tenantId,
      permission: 'role.create',
      module: 'role',
      action: 'create',
      entityType: 'Role',
      entityId: role._id,
      entityName: role.name,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      method: req.method,
      endpoint: req.path,
      status: 'success',
    });

    res.status(201).json({
      message: 'Role created successfully',
      roleId: role._id,
      role,
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

/**
 * PUT /api/rbac/roles/:roleId
 * Update role permissions
 */
router.put('/roles/:roleId', requirePermission('role.manage'), async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionIds, description } = req.body;
    const tenantId = req.headers['x-tenant-id'] || req.user.tenantId;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // System roles can't be modified (except by super admin)
    if (role.roleType === 'system' && req.user.role !== 'super-admin') {
      return res.status(403).json({ error: 'Cannot modify system roles' });
    }

    const oldPermissions = role.permissions;

    // Update permissions
    if (permissionIds && Array.isArray(permissionIds)) {
      const permissions = [];
      for (const permId of permissionIds) {
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
      role.permissions = permissions;
      role.permissionCount = permissions.length;
    }

    if (description) role.description = description;

    role.updatedBy = req.user.id;
    await role.save();

    // Log audit event
    await logAuditEvent({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      tenantId,
      permission: 'role.manage',
      module: 'role',
      action: 'update',
      entityType: 'Role',
      entityId: role._id,
      entityName: role.name,
      oldValues: { permissions: oldPermissions },
      newValues: { permissions: role.permissions },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      method: req.method,
      endpoint: req.path,
      status: 'success',
    });

    res.json({ message: 'Role updated successfully', role });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

/**
 * DELETE /api/rbac/roles/:roleId
 * Delete custom role
 */
router.delete('/roles/:roleId', requirePermission('role.manage'), async (req, res) => {
  try {
    const { roleId } = req.params;
    const tenantId = req.headers['x-tenant-id'] || req.user.tenantId;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Can't delete system roles
    if (role.roleType === 'system') {
      return res.status(403).json({ error: 'Cannot delete system roles' });
    }

    // Check if any users have this role
    const userCount = await UserRole.countDocuments({ roleId });
    if (userCount > 0) {
      return res.status(400).json({
        error: `Cannot delete role. ${userCount} user(s) assigned to this role`,
      });
    }

    await Role.deleteOne({ _id: roleId });

    // Log audit event
    await logAuditEvent({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      tenantId,
      permission: 'role.manage',
      module: 'role',
      action: 'delete',
      entityType: 'Role',
      entityId: roleId,
      entityName: role.name,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      method: req.method,
      endpoint: req.path,
      status: 'success',
    });

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

/**
 * POST /api/rbac/assign-role
 * Assign role to user
 */
router.post('/assign-role', requirePermission('user.create'), async (req, res) => {
  try {
    const { userId, roleId, expiresAt } = req.body;
    const tenantId = req.headers['x-tenant-id'] || req.user.tenantId;

    // Validate user and role exist
    const user = await User.findById(userId);
    const role = await Role.findById(roleId);

    if (!user || !role) {
      return res.status(404).json({ error: 'User or role not found' });
    }

    // Remove existing user role for this tenant
    await UserRole.updateMany(
      { userId, tenantId, status: 'active' },
      { status: 'revoked', revokedAt: new Date(), revokedBy: req.user.id }
    );

    // Create new user role
    const userRole = new UserRole({
      userId,
      roleId,
      tenantId,
      roleName: role.name,
      roleScope: role.scope,
      permissions: role.permissions,
      assignedBy: req.user.id,
      expiresAt,
    });

    await userRole.save();

    // Log audit event
    await logAuditEvent({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      tenantId,
      permission: 'user.create',
      module: 'user',
      action: 'assign',
      entityType: 'UserRole',
      entityId: userRole._id,
      entityName: `${user.name} - ${role.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      method: req.method,
      endpoint: req.path,
      status: 'success',
    });

    res.status(201).json({
      message: 'Role assigned successfully',
      userRoleId: userRole._id,
    });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Failed to assign role' });
  }
});

/**
 * GET /api/rbac/user-permissions
 * Get current user's permissions
 */
router.get('/user-permissions', async (req, res) => {
  try {
    const userId = req.user.id;
    const tenantId = req.headers['x-tenant-id'] || req.user.tenantId;

    // Super admin has all permissions
    if (req.user.role === 'super-admin') {
      const allPermissions = await Permission.find({ isActive: true });
      return res.json({
        permissions: allPermissions,
        isSuperAdmin: true,
      });
    }

    // Get user role and permissions
    const userRole = await UserRole.findOne(
      { userId, tenantId, status: 'active' },
      'permissions roleName'
    );

    if (!userRole) {
      return res.json({ permissions: [], roleName: 'No Role' });
    }

    res.json({
      permissions: userRole.permissions,
      roleName: userRole.roleName,
      isSuperAdmin: false,
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

/**
 * GET /api/rbac/audit-logs
 * Get audit logs
 */
router.get('/audit-logs', requirePermission('audit.view'), async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || req.user.tenantId;
    const { module, action, entityType, limit = 50, page = 1 } = req.query;

    const filter = { tenantId };
    if (module) filter.module = module;
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;

    const skip = (page - 1) * limit;
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await AuditLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

module.exports = router;
