/**
 * Tenant Interceptor
 * Automatically attaches tenant ID to all HTTP requests
 */

import { inject, Injector, Injectable } from '@angular/core';
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
  private injector = inject(Injector);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    const user = authService.getCurrentUserSync();

    if (user && user.tenantId) {
      req = req.clone({
        setHeaders: {
          'X-Tenant-ID': user.tenantId,
        },
      });
    }

    return next.handle(req);
  }
}
