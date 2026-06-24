import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RbacService } from '../rbac.service';

@Injectable({
  providedIn: 'root'
})
export class TenantGuard implements CanActivate {
  constructor(
    private rbacService: RbacService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const context = this.rbacService.getContext();

    if (!context) {
      console.warn('No user context found. Redirecting to login.');
      this.router.navigate(['/login']);
      return of(false);
    }

    const routeTenantId = route.params['tenantId'];
    
    if (routeTenantId && routeTenantId !== context.tenantId) {
      console.warn('Tenant mismatch. Access denied.');
      this.router.navigate(['/forbidden']);
      return of(false);
    }

    return of(true).pipe(
      catchError(() => {
        this.router.navigate(['/error']);
        return of(false);
      })
    );
  }
}

/**
 * Usage in routing:
 * 
 * {
 *   path: 'dashboard/:tenantId',
 *   component: DashboardComponent,
 *   canActivate: [TenantGuard],
 *   data: { title: 'Dashboard' }
 * }
 * 
 * This ensures:
 * 1. User is authenticated
 * 2. User belongs to the tenant in the URL
 * 3. Prevents cross-tenant access
 */
