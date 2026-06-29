import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getSummary(): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.DASHBOARD.GET_SUMMARY).pipe(map((r: ApiResponse) => r.data));
  }

  getOrders(): Observable<any> {
    // Orders list lives at /orders
    return this.apiService.get(API_ENDPOINTS.DASHBOARD.GET_ORDERS).pipe(map((r: ApiResponse) => r.data));
  }

  getInventory(): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.DASHBOARD.GET_INVENTORY).pipe(map((r: ApiResponse) => r.data));
  }

  getPayments(): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.DASHBOARD.GET_PAYMENTS).pipe(map((r: ApiResponse) => r.data));
  }

  getCollections(): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.DASHBOARD.GET_COLLECTIONS).pipe(map((r: ApiResponse) => r.data));
  }

  getVisits(): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.DASHBOARD.GET_VISITS).pipe(map((r: ApiResponse) => r.data));
  }

  getMetrics(): Observable<any> {
    // Use analytics summary endpoint for metrics
    return this.apiService.get(API_ENDPOINTS.DASHBOARD.GET_METRICS).pipe(map((r: ApiResponse) => r.data));
  }

  getCharts(): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.DASHBOARD.GET_CHARTS).pipe(map((r: ApiResponse) => r.data));
  }

  getSalesPerformance(filters?: any): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.ANALYTICS.GET_SALES, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getInventoryPerformance(filters?: any): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.ANALYTICS.GET_INVENTORY, filters).pipe(map((r: ApiResponse) => r.data));
  }
}
