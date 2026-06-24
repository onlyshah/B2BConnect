import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: ApiService) {}

  getOrders(filters?: any): Observable<any[]> {
    return this.apiService
      .get<any[]>(API_ENDPOINTS.ORDERS.GET_ALL, filters)
      .pipe(map((response: ApiResponse<any[]>) => response.data));
  }

  getOrder(id: string): Observable<any> {
    const endpoint = API_ENDPOINTS.ORDERS.GET_BY_ID.replace(':orderId', id);
    return this.apiService
      .get<any>(endpoint)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  createOrder(order: any): Observable<any> {
    return this.apiService
      .post<any>(API_ENDPOINTS.ORDERS.CREATE, order)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    const endpoint = API_ENDPOINTS.ORDERS.STATUS_CHANGE.replace(':orderId', id);
    return this.apiService
      .patch<any>(endpoint, { status })
      .pipe(map((response: ApiResponse<any>) => response.data));
  }
}
