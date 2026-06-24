import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  CanDeactivate,
} from '@angular/router';
import { PermissionService } from '../services/rbac/permission.service';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate, CanActivateChild {
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkPermission(route, state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkPermission(route, state.url);
  }

  private checkPermission(
    route: ActivatedRouteSnapshot,
    url: string
  ): Observable<boolean> | boolean {
    // Get required permission(s) from route data
    const requiredPermission = route.data['permission'];
    const permissionLogic = route.data['permissionLogic'] || 'single'; // 'single', 'any', 'all'

    // If no permission required, allow access
    if (!requiredPermission) {
      return true;
    }

    // Check permission
    const hasAccess = this.checkAccess(requiredPermission, permissionLogic);

    if (!hasAccess) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }

  private checkAccess(
    requiredPermission: string | string[],
    logic: string
  ): boolean {
    if (logic === 'single') {
      return this.permissionService.hasPermission(requiredPermission as string);
    } else if (logic === 'any') {
      return this.permissionService.hasAnyPermission(
        Array.isArray(requiredPermission)
          ? requiredPermission
          : [requiredPermission]
      );
    } else if (logic === 'all') {
      return this.permissionService.hasAllPermissions(
        Array.isArray(requiredPermission)
          ? requiredPermission
          : [requiredPermission]
      );
    }

    return false;
  }
}
