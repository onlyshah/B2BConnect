/**
 * RBAC Models - Permission-Driven Architecture
 * NO hardcoded role checks - All UI elements driven by permissions
 */

export interface Permission {
  id: string;
  module: string; // 'product', 'order', 'inventory', etc.
  action: string; // 'create', 'read', 'update', 'delete', 'approve', 'export'
  description: string;
  tenantId: string;
  createdAt: Date;
}

export interface Role {
  id: string;
  name: string; // 'Company Admin', 'Distributor Manager', 'Salesman', 'Retailer'
  description: string;
  tenantId: string;
  permissions: string[]; // permission IDs
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  tenantId: string;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date; // For temporary role assignments
}

export interface PermissionContext {
  userId: string;
  tenantId: string;
  roles: Role[];
  permissions: Permission[];
  features?: string[]; // Subscription-based features
}

export interface PermissionCheck {
  module: string;
  action: string; // or pass full 'module.action' permission string
}

// Action Metadata
export interface ActionPermission {
  label: string;
  permission: string; // e.g., 'product.create'
  icon?: string;
  color?: string;
  confirmation?: boolean;
}

export interface ResourceAction {
  id: string;
  name: string;
  permission: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
  confirmation?: string;
  handler?: () => void;
}
