import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.authInitializationStarted) {
      this.authService.initializeAuthState();
    }

    const isAuthenticated = this.authService.isAuthenticated() && !!this.authService.getCurrentUserSync();

    if (isAuthenticated) {
      return true;
    }

    if (this.authService.isAuthInitializationInProgress) {
      return this.authService.authInitialization$.pipe(
        filter((initialized) => initialized === true),
        take(1),
        map(() => {
          const authenticatedAfterInit = this.authService.isAuthenticated() && !!this.authService.getCurrentUserSync();
          return authenticatedAfterInit ? true : this.createLoginUrlTree(state);
        }),
        catchError(() => of(this.createLoginUrlTree(state)))
      );
    }

    return this.handleUnauthenticated(state);
  }

  private handleUnauthenticated(state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (this.authService.getRefreshToken()) {
      return this.authService.refreshToken().pipe(
        map(() => true),
        catchError(() => of(this.createLoginUrlTree(state)))
      );
    }

    return of(this.createLoginUrlTree(state));
  }

  private createLoginUrlTree(state: RouterStateSnapshot): UrlTree {
    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
}
