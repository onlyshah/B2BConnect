const UserRole = require('../../models/rbac/UserRole');
const AuditLog = require('../../models/rbac/AuditLog');

/**
 * Get user permissions from UserRole
 */
async function getUserPermissions(userId, tenantId) {
  try {
    const userRole = await UserRole.findOne(
      {
        userId,
        tenantId,
        status: 'active',
      },
      'permissions'
    ).lean();

    if (!userRole) {
      return [];
    }

    return userRole.permissions || [];
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
}

/**
 * Check if user has specific permission
 */
function hasPermission(permissions, requiredPermission) {
  return permissions.some((p) => p.name === requiredPermission);
}

/**
 * Check if user has any of the required permissions (OR logic)
 */
function hasAnyPermission(permissions, requiredPermissions) {
  return requiredPermissions.some((perm) =>
    permissions.some((p) => p.name === perm)
  );
}

/**
 * Check if user has all required permissions (AND logic)
 */
function hasAllPermissions(permissions, requiredPermissions) {
  return requiredPermissions.every((perm) =>
    permissions.some((p) => p.name === perm)
  );
}

/**
 * Main middleware to check permission
 * Attach to middleware stack for protected routes
 * 
 * Usage:
 * router.post('/products', requirePermission('product.create'), controller);
 */
function requirePermission(requiredPermission, logicType = 'single') {
  return async (req, res, next) => {
    try {
      // Assumes authenticate middleware already sets req.user
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;
      const tenantId = req.headers['x-tenant-id'] || req.user.tenantId;

      // Super admin has all permissions
      if (req.user.role === 'super-admin') {
        req.permissions = ['*']; // Wildcard for super admin
        return next();
      }

      // Get user permissions
      const permissions = await getUserPermissions(userId, tenantId);

      // Check permission
      let hasAccess = false;

      if (logicType === 'single') {
        hasAccess = hasPermission(permissions, requiredPermission);
      } else if (logicType === 'any') {
        hasAccess = hasAnyPermission(permissions, Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]);
      } else if (logicType === 'all') {
        hasAccess = hasAllPermissions(permissions, Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]);
      }

      if (!hasAccess) {
        // Log failed permission attempt
        await logAuditEvent({
          userId,
          userName: req.user.name,
          userRole: req.user.role,
          tenantId,
          permission: requiredPermission,
          module: extractModule(requiredPermission),
          action: extractAction(requiredPermission),
          entityType: extractModule(requiredPermission),
          entityId: null,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          method: req.method,
          endpoint: req.path,
          status: 'failure',
          errorMessage: `Permission denied: ${requiredPermission}`,
        });

        return res.status(403).json({
          error: 'Insufficient permissions',
          permission: requiredPermission,
        });
      }

      // Attach permissions to request for later use
      req.permissions = permissions;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware for multiple permissions (AND logic)
 */
function requirePermissions(requiredPermissions) {
  return requirePermission(requiredPermissions, 'all');
}

/**
 * Middleware for any of multiple permissions (OR logic)
 */
function requireAnyPermission(requiredPermissions) {
  return requirePermission(requiredPermissions, 'any');
}

/**
 * Log audit event
 */
async function logAuditEvent(auditData) {
  try {
    const log = new AuditLog(auditData);
    await log.save();
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

/**
 * Extract module from permission (e.g., 'product' from 'product.create')
 */
function extractModule(permission) {
  return permission.split('.')[0];
}

/**
 * Extract action from permission (e.g., 'create' from 'product.create')
 */
function extractAction(permission) {
  return permission.split('.')[1];
}

/**
 * Get user permissions (for frontend/client)
 */
async function getUserPermissionsMiddleware(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.id;
    const tenantId = req.headers['x-tenant-id'] || req.user.tenantId;

    // Super admin has all permissions
    if (req.user.role === 'super-admin') {
      req.userPermissions = ['*'];
      return next();
    }

    const permissions = await getUserPermissions(userId, tenantId);
    req.userPermissions = permissions;
    next();
  } catch (error) {
    console.error('Error getting user permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  requirePermission,
  requirePermissions,
  requireAnyPermission,
  logAuditEvent,
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  extractModule,
  extractAction,
  getUserPermissionsMiddleware,
};
