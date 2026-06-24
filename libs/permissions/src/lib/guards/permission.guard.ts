import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RbacService } from '../rbac.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private rbacService: RbacService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredPermissions = route.data['permissions'] as string[];
    const requireAll = route.data['requireAll'] ?? false;

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const hasAccess = requireAll
      ? this.rbacService.hasAllPermissions(requiredPermissions)
      : this.rbacService.hasAnyPermission(requiredPermissions);

    if (hasAccess) {
      return true;
    }

    console.warn(`Access denied to ${state.url}. Required permissions: ${requiredPermissions.join(', ')}`);
    this.router.navigate(['/forbidden']);
    return false;
  }
}

/**
 * Usage in routing:
 * 
 * {
 *   path: 'products',
 *   component: ProductListComponent,
 *   canActivate: [PermissionGuard],
 *   data: {
 *     permissions: ['product.view'],
 *     requireAll: false
 *   }
 * }
 * 
 * Multiple permissions (OR logic):
 * {
 *   path: 'products/create',
 *   component: ProductCreateComponent,
 *   canActivate: [PermissionGuard],
 *   data: {
 *     permissions: ['product.create', 'product.manage']
 *   }
 * }
 * 
 * Multiple permissions (AND logic):
 * {
 *   path: 'products/publish',
 *   component: ProductPublishComponent,
 *   canActivate: [PermissionGuard],
 *   data: {
 *     permissions: ['product.create', 'product.publish'],
 *     requireAll: true
 *   }
 * }
 */
