import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class ReturnService {
  constructor(private apiService: ApiService) {}

  getReturns(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.RETURNS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getReturn(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.RETURNS.GET_BY_ID.replace(':returnId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createReturn(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.RETURNS.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateReturn(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.RETURNS.UPDATE.replace(':returnId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteReturn(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.RETURNS.DELETE.replace(':returnId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getReturnsByOrder(orderId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.RETURNS.GET_BY_ORDER.replace(':orderId', orderId), filters).pipe(map((r: ApiResponse) => r.data));
  }

  approveReturn(id: string, data?: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.RETURNS.APPROVE.replace(':returnId', id), data).pipe(map((r: ApiResponse) => r.data));
  }
}
