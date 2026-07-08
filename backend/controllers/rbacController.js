const Permission = require('../models/rbac/Permission');
const Role = require('../models/rbac/Role');
const UserRole = require('../models/rbac/UserRole');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

const buildRoleFilter = (req, extra = {}) => ({
  companyId: resolveCompanyId(req),
  isDeleted: false,
  ...extra,
});

// Get all permissions
const getPermissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const permissions = await Permission.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const total = await Permission.countDocuments();

    res.json({
      success: true,
      data: permissions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all roles
const getRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const roles = await Role.find(buildRoleFilter(req))
      .populate('permissions')
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const total = await Role.countDocuments(buildRoleFilter(req));

    res.json({
      success: true,
      data: roles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create role
const createRole = async (req, res) => {
  try {
    const { name, displayName, description, permissions } = req.body;

    if (!name || !displayName || !description) {
      return res.status(400).json({ success: false, message: 'Name, display name, and description are required' });
    }

    const role = new Role({
      name: name.toLowerCase(),
      displayName,
      description,
      permissions: permissions || [],
      companyId: resolveCompanyId(req),
      isSystem: false,
    });

    await role.save();
    await role.populate('permissions');

    res.status(201).json({ success: true, data: role, message: 'Role created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update role
const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      { _id: req.params.roleId, ...buildRoleFilter(req) },
      req.body,
      { new: true }
    ).populate('permissions');

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    res.json({ success: true, data: role, message: 'Role updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add permission to role
const addPermissionToRole = async (req, res) => {
  try {
    const { permissionId } = req.body;

    if (!permissionId) {
      return res.status(400).json({ success: false, message: 'Permission ID is required' });
    }

    const role = await Role.findByIdAndUpdate(
      { _id: req.params.roleId, ...buildRoleFilter(req) },
      { $addToSet: { permissions: permissionId } },
      { new: true }
    ).populate('permissions');

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    res.json({ success: true, data: role, message: 'Permission added to role' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove permission from role
const removePermissionFromRole = async (req, res) => {
  try {
    const { permissionId } = req.body;

    if (!permissionId) {
      return res.status(400).json({ success: false, message: 'Permission ID is required' });
    }

    const role = await Role.findByIdAndUpdate(
      { _id: req.params.roleId, ...buildRoleFilter(req) },
      { $pull: { permissions: permissionId } },
      { new: true }
    ).populate('permissions');

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    res.json({ success: true, data: role, message: 'Permission removed from role' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete role
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.roleId, ...buildRoleFilter(req) },
      { isDeleted: true, deletedAt: new Date(), isActive: false },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    if (role.isSystem) {
      return res.status(400).json({ success: false, message: 'Cannot delete system role' });
    }

    res.json({ success: true, message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's permissions
const getUserPermissions = async (req, res) => {
  try {
    const userRole = await UserRole.findOne({
      userId: req.params.userId,
      companyId: resolveCompanyId(req),
      tenantId: req.tenantId,
      isDeleted: false,
    }).populate({
      path: 'roleId',
      populate: { path: 'permissions' },
    });

    if (!userRole) {
      return res.json({ success: true, data: { permissions: [], roles: [] } });
    }

    const permissions = userRole.roleId.permissions || [];
    const permissionNames = permissions.map(p => p.name);

    res.json({
      success: true,
      data: {
        userId: req.params.userId,
        roleId: userRole.roleId._id,
        roleName: userRole.roleId.displayName,
        permissions: permissionNames,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign role to user
const assignRoleToUser = async (req, res) => {
  try {
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ success: false, message: 'Role ID is required' });
    }

    // Remove existing role
    await UserRole.deleteOne({
      userId: req.params.userId,
      companyId: resolveCompanyId(req),
      tenantId: req.tenantId,
    });

    // Assign new role
    const userRole = new UserRole({
      userId: req.params.userId,
      roleId,
      tenantId: req.tenantId,
      companyId: resolveCompanyId(req),
    });

    await userRole.save();
    await userRole.populate({
      path: 'roleId',
      populate: { path: 'permissions' },
    });

    res.json({ success: true, data: userRole, message: 'Role assigned to user' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPermissions,
  getRoles,
  createRole,
  updateRole,
  addPermissionToRole,
  removePermissionFromRole,
  deleteRole,
  getUserPermissions,
  assignRoleToUser,
};
