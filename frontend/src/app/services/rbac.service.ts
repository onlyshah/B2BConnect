import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class RbacService {
  constructor(private apiService: ApiService) {}

  // Permissions
  getPermissions(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.RBAC.PERMISSIONS_GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getPermission(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.RBAC.PERMISSIONS_GET_BY_ID.replace(':permissionId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createPermission(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.RBAC.PERMISSIONS_CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updatePermission(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.RBAC.PERMISSIONS_UPDATE.replace(':permissionId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deletePermission(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.RBAC.PERMISSIONS_DELETE.replace(':permissionId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  // Roles
  getRoles(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.RBAC.ROLES_GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getRole(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.RBAC.ROLES_GET_BY_ID.replace(':roleId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createRole(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.RBAC.ROLES_CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateRole(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.RBAC.ROLES_UPDATE.replace(':roleId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteRole(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.RBAC.ROLES_DELETE.replace(':roleId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getRolesByTenant(tenantId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.RBAC.ROLES_GET_BY_TENANT.replace(':tenantId', tenantId), filters).pipe(map((r: ApiResponse) => r.data));
  }

  // User Roles
  getUserRoles(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.RBAC.USER_ROLES_GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  assignUserRole(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.RBAC.USER_ROLES_CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  removeUserRole(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.RBAC.USER_ROLES_DELETE.replace(':userRoleId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getUserRolesByUser(userId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.RBAC.USER_ROLES_BY_USER.replace(':userId', userId), filters).pipe(map((r: ApiResponse) => r.data));
  }
}
