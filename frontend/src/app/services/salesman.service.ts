import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class SalesmanService {
  constructor(private apiService: ApiService) {}

  getSalesmen(filters?: { status?: string; territory?: string; page?: number; limit?: number }): Observable<any> {
    return this.apiService
      .get<any[]>(API_ENDPOINTS.SALESMEN.GET_ALL, filters)
      .pipe(map((response: ApiResponse<any[]>) => response.data));
  }

  getSalesman(id: string): Observable<any> {
    const endpoint = API_ENDPOINTS.SALESMEN.GET_BY_ID.replace(':salesmanId', id);
    return this.apiService
      .get<any>(endpoint)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  createSalesman(data: any): Observable<any> {
    return this.apiService
      .post<any>(API_ENDPOINTS.SALESMEN.CREATE, data)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  updateSalesman(id: string, data: any): Observable<any> {
    const endpoint = API_ENDPOINTS.SALESMEN.UPDATE.replace(':salesmanId', id);
    return this.apiService
      .patch<any>(endpoint, data)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  deleteSalesman(id: string): Observable<any> {
    const endpoint = API_ENDPOINTS.SALESMEN.DELETE.replace(':salesmanId', id);
    return this.apiService
      .delete<any>(endpoint)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  getSalesmanDashboard(id: string): Observable<any> {
    const endpoint = API_ENDPOINTS.SALESMEN.GET_PERFORMANCE.replace(':salesmanId', id);
    return this.apiService
      .get<any>(endpoint)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }
}
