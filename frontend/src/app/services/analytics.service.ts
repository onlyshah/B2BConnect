import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private apiService: ApiService) {}

  getSalesAnalytics(filters?: any): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.ANALYTICS.GET_SALES, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getPerformanceAnalytics(filters?: any): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.ANALYTICS.GET_PERFORMANCE, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getTrendsAnalytics(filters?: any): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.ANALYTICS.GET_TRENDS, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getReports(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.ANALYTICS.GET_REPORTS, filters).pipe(map((r: ApiResponse) => r.data));
  }

  exportReport(filters?: any): Observable<Blob> {
    return this.apiService.downloadFile(API_ENDPOINTS.ANALYTICS.EXPORT_REPORT);
  }
}
