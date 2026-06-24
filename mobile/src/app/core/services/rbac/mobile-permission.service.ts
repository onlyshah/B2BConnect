import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Permission {
  name: string;
  module: string;
  action: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MobilePermissionService {
  private apiUrl = 'http://localhost:4000/api/rbac';
  private userPermissionsSubject = new BehaviorSubject<Permission[]>([]);
  private isSuperAdminSubject = new BehaviorSubject<boolean>(false);

  public userPermissions$ = this.userPermissionsSubject.asObservable();
  public isSuperAdmin$ = this.isSuperAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserPermissions();
  }

  loadUserPermissions(): void {
    this.http.get<any>(`${this.apiUrl}/user-permissions`).subscribe(
      (response) => {
        this.userPermissionsSubject.next(response.permissions || []);
        this.isSuperAdminSubject.next(response.isSuperAdmin || false);
      },
      (error) => {
        console.error('Error loading permissions:', error);
        this.userPermissionsSubject.next([]);
      }
    );
  }

  hasPermission(permission: string): boolean {
    if (this.isSuperAdminSubject.value) return true;
    return this.userPermissionsSubject.value.some((p) => p.name === permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    if (this.isSuperAdminSubject.value) return true;
    const userPerms = this.userPermissionsSubject.value;
    return permissions.some((perm) => userPerms.some((p) => p.name === perm));
  }

  hasAllPermissions(permissions: string[]): boolean {
    if (this.isSuperAdminSubject.value) return true;
    const userPerms = this.userPermissionsSubject.value;
    return permissions.every((perm) => userPerms.some((p) => p.name === perm));
  }

  getUserPermissions(): Permission[] {
    return this.userPermissionsSubject.value;
  }

  isSuperAdmin(): boolean {
    return this.isSuperAdminSubject.value;
  }

  refreshPermissions(): Observable<Permission[]> {
    return new Observable((observer) => {
      this.loadUserPermissions();
      setTimeout(() => {
        observer.next(this.getUserPermissions());
        observer.complete();
      }, 500);
    });
  }
}
