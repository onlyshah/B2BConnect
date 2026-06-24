/**
 * RBAC SERVICE - Core Permission Management
 * - No hardcoded role checks
 * - All UI driven by permissions
 * - Tenant-isolated
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Permission, PermissionContext, Role } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  private apiUrl = 'http://localhost:4000/api/rbac';
  
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();
  
  private rolesSubject = new BehaviorSubject<Role[]>([]);
  public roles$ = this.rolesSubject.asObservable();
  
  private contextSubject = new BehaviorSubject<PermissionContext | null>(null);
  public context$ = this.contextSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load user's complete permission context on login
   */
  loadUserContext(userId: string, tenantId: string): Observable<PermissionContext> {
    return this.http
      .get<PermissionContext>(`${this.apiUrl}/user-context`, {
        headers: { 'x-tenant-id': tenantId }
      })
      .pipe(
        tap((context) => {
          this.contextSubject.next(context);
          this.permissionsSubject.next(context.permissions);
          this.rolesSubject.next(context.roles);
        }),
        catchError((error) => {
          console.error('Failed to load permission context:', error);
          return of(null as any);
        })
      );
  }

  /**
   * Check if user has a specific permission
   * Usage: if (this.rbacService.hasPermission('product.create')) { ... }
   */
  hasPermission(permission: string): boolean {
    const permissions = this.permissionsSubject.getValue();
    if (!permissions) return false;
    
    // Super admin check (wildcard)
    if (permissions.some(p => p.action === '*')) return true;
    
    return permissions.some(p => `${p.module}.${p.action}` === permission);
  }

  /**
   * Check if user has ANY of the provided permissions (OR logic)
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  /**
   * Check if user has ALL of the provided permissions (AND logic)
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }

  /**
   * Get all permissions for a module
   */
  getModulePermissions(module: string): Permission[] {
    const permissions = this.permissionsSubject.getValue();
    return permissions.filter(p => p.module === module);
  }

  /**
   * Get user's roles
   */
  getRoles(): Role[] {
    return this.rolesSubject.getValue();
  }

  /**
   * Get user's complete permission context
   */
  getContext(): PermissionContext | null {
    return this.contextSubject.getValue();
  }

  /**
   * Refresh permissions (call after permission changes)
   */
  refreshPermissions(): Observable<PermissionContext> {
    const context = this.contextSubject.getValue();
    if (!context) return of(null as any);
    
    return this.loadUserContext(context.userId, context.tenantId);
  }

  /**
   * Get all available permissions (for admin role management)
   */
  getAllPermissions(tenantId: string): Observable<Permission[]> {
    return this.http
      .get<{ permissions: Permission[] }>(`${this.apiUrl}/permissions`, {
        headers: { 'x-tenant-id': tenantId }
      })
      .pipe(
        map(response => response.permissions),
        tap(permissions => this.permissionsSubject.next(permissions))
      );
  }

  /**
   * Get roles for tenant
   */
  getRolesForTenant(tenantId: string): Observable<Role[]> {
    return this.http
      .get<{ roles: Role[] }>(`${this.apiUrl}/roles`, {
        headers: { 'x-tenant-id': tenantId }
      })
      .pipe(
        map(response => response.roles),
        tap(roles => this.rolesSubject.next(roles))
      );
  }

  /**
   * Create a new role
   */
  createRole(role: Partial<Role>, tenantId: string): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/roles`, role, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Update a role
   */
  updateRole(roleId: string, updates: Partial<Role>, tenantId: string): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/roles/${roleId}`, updates, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Assign permission to role
   */
  assignPermissionToRole(
    roleId: string,
    permissionId: string,
    tenantId: string
  ): Observable<Role> {
    return this.http.post<Role>(
      `${this.apiUrl}/roles/${roleId}/permissions`,
      { permissionId },
      { headers: { 'x-tenant-id': tenantId } }
    );
  }

  /**
   * Assign role to user
   */
  assignRoleToUser(
    userId: string,
    roleId: string,
    tenantId: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/${userId}/roles`,
      { roleId },
      { headers: { 'x-tenant-id': tenantId } }
    );
  }

  /**
   * Get audit logs for user actions
   */
  getAuditLogs(
    tenantId: string,
    filters?: { userId?: string; module?: string; startDate?: Date; endDate?: Date }
  ): Observable<any[]> {
    return this.http.get<{ logs: any[] }>(`${this.apiUrl}/audit-logs`, {
      headers: { 'x-tenant-id': tenantId },
      params: filters as any
    }).pipe(
      map(response => response.logs)
    );
  }

  /**
   * Check if user can perform action on resource
   * Useful for granular checks
   */
  canPerformAction(resourceType: string, action: string): boolean {
    const permission = `${resourceType}.${action}`;
    return this.hasPermission(permission);
  }
}
