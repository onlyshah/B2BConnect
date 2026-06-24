/**
 * Tenant Interceptor
 * Automatically attaches tenant ID to all HTTP requests
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = this.authService.getCurrentUserSync();

    if (user && user.tenantId) {
      // Add tenant ID as header
      req = req.clone({
        setHeaders: {
          'X-Tenant-ID': user.tenantId,
        },
      });
    }

    return next.handle(req);
  }
}
