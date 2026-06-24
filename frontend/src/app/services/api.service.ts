/**
 * Global API Service
 * Centralized HTTP client for all API requests
 * Handles GET, POST, PUT, PATCH, DELETE, file uploads/downloads
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout, filter, map } from 'rxjs/operators';
import { API_BASE_URL } from '../constants/api-endpoints';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = API_BASE_URL;
  private readonly defaultTimeout = 30000; // 30 seconds
  private readonly defaultRetries = 1;

  constructor(private http: HttpClient) {}

  /**
   * GET request
   */
  get<T = any>(
    endpoint: string,
    params?: PaginationParams,
    options?: any
  ): Observable<ApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const httpOptions = { params: httpParams, ...options };

    return (this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, httpOptions) as unknown as Observable<ApiResponse<T>>)
      .pipe(
        timeout(this.defaultTimeout),
        retry(this.defaultRetries),
        catchError(this.handleError)
      );
  }

  /**
   * POST request
   */
  post<T = any>(
    endpoint: string,
    body: any = {},
    params?: PaginationParams,
    options?: any
  ): Observable<ApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const httpOptions = { params: httpParams, ...options };

    return (this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, httpOptions) as unknown as Observable<ApiResponse<T>>)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * PUT request
   */
  put<T = any>(
    endpoint: string,
    body: any = {},
    params?: PaginationParams,
    options?: any
  ): Observable<ApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const httpOptions = { params: httpParams, ...options };

    return (this.http
      .put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, httpOptions) as unknown as Observable<ApiResponse<T>>)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * PATCH request
   */
  patch<T = any>(
    endpoint: string,
    body: any = {},
    params?: PaginationParams,
    options?: any
  ): Observable<ApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const httpOptions = { params: httpParams, ...options };

    return (this.http
      .patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, httpOptions) as unknown as Observable<ApiResponse<T>>)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * DELETE request
   */
  delete<T = any>(
    endpoint: string,
    params?: PaginationParams,
    options?: any
  ): Observable<ApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const httpOptions = { params: httpParams, ...options };

    return (this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, httpOptions) as unknown as Observable<ApiResponse<T>>)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * File upload
   */
  uploadFile<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Observable<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, formData)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * Multiple file upload
   */
  uploadFiles<T = any>(
    endpoint: string,
    files: File[],
    fieldName: string = 'files',
    additionalData?: Record<string, any>
  ): Observable<ApiResponse<T>> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append(fieldName, file);
    });

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, formData)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * File download
   */
  downloadFile(endpoint: string, filename?: string): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}${endpoint}`, {
        responseType: 'blob',
      })
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * Build HTTP params from object
   */
  private buildHttpParams(params?: PaginationParams): HttpParams {
    let httpParams = new HttpParams();

    if (!params) {
      return httpParams;
    }

    Object.keys(params).forEach((key) => {
      const value = params[key];

      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            httpParams = httpParams.append(key, v);
          });
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return httpParams;
  }

  /**
   * Global error handler
   */
  private handleError(error: any) {
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 0;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message || errorMessage;
    } else if (error.status) {
      // Server-side error
      statusCode = error.status;

      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request: Invalid data provided';
            break;
          case 401:
            errorMessage = 'Unauthorized: Please login again';
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission';
            break;
          case 404:
            errorMessage = 'Not Found: Resource does not exist';
            break;
          case 409:
            errorMessage = 'Conflict: Resource already exists';
            break;
          case 422:
            errorMessage = 'Validation Error: ' + JSON.stringify(error.error.errors);
            break;
          case 429:
            errorMessage = 'Too Many Requests: Please try again later';
            break;
          case 500:
            errorMessage = 'Server Error: Please contact support';
            break;
          case 503:
            errorMessage = 'Service Unavailable: Please try again later';
            break;
          default:
            errorMessage = `HTTP Error ${error.status}`;
        }
      }
    }

    console.error(`[API ERROR] Status: ${statusCode}, Message: ${errorMessage}`, error);

    return throwError(() => ({
      statusCode,
      message: errorMessage,
      error: error.error,
    }));
  }
}
