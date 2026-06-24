/**
 * User Model with Multi-Tenant Support
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  tenantId: string;
  active: boolean;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme?: 'light' | 'dark';
  language?: string;
  timezone?: string;
  notifications?: NotificationPreferences;
}

export interface NotificationPreferences {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  inApp?: boolean;
}

export interface UserSession {
  userId: string;
  tenantId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  roles: string[]; // role IDs
  permissions: string[]; // permission strings like 'product.create'
}

export interface TenantUser {
  userId: string;
  tenantId: string;
  role: 'admin' | 'manager' | 'user';
  joinedAt: Date;
}
