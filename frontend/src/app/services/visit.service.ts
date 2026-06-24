import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  constructor(private apiService: ApiService) {}

  getVisits(filters?: any): Observable<any[]> {
    return this.apiService
      .get<any[]>(API_ENDPOINTS.VISITS.GET_ALL, filters)
      .pipe(map((response: ApiResponse<any[]>) => response.data));
  }

  getVisit(id: string): Observable<any> {
    const endpoint = API_ENDPOINTS.VISITS.GET_BY_ID.replace(':visitId', id);
    return this.apiService
      .get<any>(endpoint)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  createVisit(data: any): Observable<any> {
    return this.apiService
      .post<any>(API_ENDPOINTS.VISITS.CREATE, data)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  updateVisit(id: string, data: any): Observable<any> {
    const endpoint = API_ENDPOINTS.VISITS.UPDATE.replace(':visitId', id);
    return this.apiService
      .patch<any>(endpoint, data)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  getTodayVisits(salesmanId: string): Observable<any[]> {
    const endpoint = API_ENDPOINTS.VISITS.GET_BY_SALESMAN.replace(':salesmanId', salesmanId);
    return this.apiService
      .get<any[]>(endpoint, { date: new Date().toISOString().split('T')[0] })
      .pipe(map((response: ApiResponse<any[]>) => response.data));
  }
}
