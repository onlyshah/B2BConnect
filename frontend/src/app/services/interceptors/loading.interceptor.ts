/**
 * Loading Interceptor
 * Manages global loading state for all HTTP requests
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ResponseHandlerService } from '../response-handler.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private requestCounter = 0;

  constructor(private responseHandler: ResponseHandlerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Exclude authentication endpoints from global loading to avoid
    // spinner getting stuck during token refresh/login flows
    try {
      const urlLower = (req.url || '').toLowerCase();
      if (urlLower.includes('/auth/') || urlLower.includes('/auth')) {
        return next.handle(req);
      }

      // Keep the global overlay focused on mutating actions.
      // Dashboard/data pages already manage their own loading states.
      if (req.method === 'GET') {
        return next.handle(req);
      }
    } catch (e) {
      // if anything unexpected, fall back to normal behavior
    }

    this.requestCounter++;
    this.responseHandler.setLoading(true);

    return next.handle(req).pipe(
      finalize(() => {
        this.requestCounter = Math.max(0, this.requestCounter - 1);

        // Only hide loading when all requests are done
        if (this.requestCounter === 0) {
          setTimeout(() => {
            if (this.requestCounter === 0) {
              this.responseHandler.setLoading(false);
            }
          }, 0);
        }
      })
    );
  }
}
