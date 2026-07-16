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
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { ResponseHandlerService } from '../response-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private injector = inject(Injector);
  private isLogoutInProgress = false;

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

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!isLogoutRequest && !this.authService.isLogoutActive()) {
          this.handleError(error);
        }
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        // Unauthorized - token expired or invalid
        this.handleUnauthorized();
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

  private handleUnauthorized(): void {
    if (this.isLogoutInProgress || this.authService.isLogoutActive()) {
      return;
    }

    // Try to refresh token
    this.authService.refreshToken().subscribe({
      next: () => {
        // Token refreshed successfully
      },
      error: () => {
        // Token refresh failed, logout user
        this.isLogoutInProgress = true;
        this.authService.logout().subscribe({
          next: () => {
            // Redirect to login will be handled by auth guard
          },
          error: () => {
            // Even logout failed, still clear auth state
            this.responseHandler.showError(
              'Session expired. Please login again.'
            );
          },
        });
      },
    });
  }

  private handleValidationError(error: HttpErrorResponse): void {
    if (error.error?.errors) {
      this.responseHandler.showValidationErrors(error.error.errors);
    } else {
      this.responseHandler.showError('Please check your input and try again.');
    }
  }
}
