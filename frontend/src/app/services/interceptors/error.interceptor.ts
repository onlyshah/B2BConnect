/**
 * Error Interceptor
 * Handles API errors globally and manages error responses
 */

import { inject, Injector, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { ResponseHandlerService } from '../response-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private injector = inject(Injector);
  private router = inject(Router);
  private isLogoutInProgress = false;
  private isRefreshInProgress = false;

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  private get responseHandler(): ResponseHandlerService {
    return this.injector.get(ResponseHandlerService);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isLogoutRequest = req.url.includes('/auth/logout');
    const isRefreshRequest = req.url.includes('/auth/refresh');
    const isLoginRequest = req.url.includes('/auth/login');

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!isLogoutRequest && !this.authService.isLogoutActive()) {
          this.handleError(error, isRefreshRequest, isLoginRequest);
        }
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse, isRefreshRequest: boolean, isLoginRequest: boolean): void {
    switch (error.status) {
      case 401:
        // Unauthorized - token expired or invalid
        this.handleUnauthorized(isRefreshRequest, isLoginRequest);
        break;

      case 403:
        // Forbidden - insufficient permissions
        this.responseHandler.showError(
          'You do not have permission to perform this action'
        );
        break;

      case 404:
        // Not Found
        this.responseHandler.showError('Resource not found');
        break;

      case 409:
        // Conflict
        this.responseHandler.showError('This resource already exists');
        break;

      case 422:
        // Validation Error
        this.handleValidationError(error);
        break;

      case 429:
        // Too Many Requests
        this.responseHandler.showWarning(
          'Too many requests. Please try again later.'
        );
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors
        this.responseHandler.showError(
          'Server error. Please try again later.'
        );
        break;

      default:
        // Generic error
        const message =
          error.error?.message || 'An unexpected error occurred';
        this.responseHandler.showError(message);
    }
  }

  private handleUnauthorized(isRefreshRequest: boolean, isLoginRequest: boolean): void {
    if (this.isLogoutInProgress || this.authService.isLogoutActive()) {
      return;
    }

    if (isRefreshRequest) {
      // Refresh token itself is invalid; force logout and clear auth state.
      this.isLogoutInProgress = true;
      this.authService.logout().pipe(
        finalize(() => {
          this.isLogoutInProgress = false;
        })
      ).subscribe({
        next: () => {
          this.responseHandler.showError('Session expired. Please login again.');
          // schedule navigation outside current change-detection cycle
          setTimeout(() => this.navigateToLogin(), 0);
        },
        error: () => {
          this.responseHandler.showError('Session expired. Please login again.');
          setTimeout(() => this.navigateToLogin(), 0);
        },
      });
      return;
    }

    if (isLoginRequest) {
      // Login failed with 401, do not retry refresh.
      return;
    }

    if (this.isRefreshInProgress) {
      return;
    }

    this.isRefreshInProgress = true;

    // Try to refresh token
    this.authService.refreshToken().pipe(
      finalize(() => {
        this.isRefreshInProgress = false;
      })
    ).subscribe({
      next: () => {
        // Token refreshed successfully
      },
      error: () => {
        // Token refresh failed, logout user
        this.isLogoutInProgress = true;
        this.authService.logout().pipe(
          finalize(() => {
            this.isLogoutInProgress = false;
          })
        ).subscribe({
          next: () => {
            // schedule navigation outside current change-detection cycle
            setTimeout(() => this.navigateToLogin(), 0);
          },
          error: () => {
            this.responseHandler.showError(
              'Session expired. Please login again.'
            );
            setTimeout(() => this.navigateToLogin(), 0);
          },
        });
      },
    });
  }

  private navigateToLogin(): void {
    // Perform navigation in next tick to avoid change-detection conflicts
    try {
      if (!this.router.url.includes('/login')) {
        this.router.navigate(['/login']);
      }
    } catch (e) {
      // Fallback: ensure navigation happens even if router state isn't stable
      setTimeout(() => {
        if (!this.router.url.includes('/login')) {
          this.router.navigate(['/login']);
        }
      }, 0);
    }
  }

  private handleValidationError(error: HttpErrorResponse): void {
    if (error.error?.errors) {
      this.responseHandler.showValidationErrors(error.error.errors);
    } else {
      this.responseHandler.showError('Please check your input and try again.');
    }
  }
}
