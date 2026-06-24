import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = route.data['roles'] as string[] | undefined;
    if (!roles || roles.length === 0) {
      return true;
    }

    if (!this.authService.isAuthenticated() || !this.authService.getCurrentUserSync()) {
      this.authService.logout().subscribe({
        next: () => {},
        error: () => {}
      });
      this.router.navigate(['/login']);
      return false;
    }

    if (this.authService.hasRole(roles)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
