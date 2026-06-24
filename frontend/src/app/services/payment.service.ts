import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private apiService: ApiService) {}

  getPayments(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.PAYMENTS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getPayment(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.PAYMENTS.GET_BY_ID.replace(':paymentId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createPayment(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.PAYMENTS.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updatePayment(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.PAYMENTS.UPDATE.replace(':paymentId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deletePayment(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.PAYMENTS.DELETE.replace(':paymentId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  verifyPayment(id: string, data?: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.PAYMENTS.VERIFY_PAYMENT.replace(':paymentId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  getPaymentsByInvoice(invoiceId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.PAYMENTS.GET_BY_INVOICE.replace(':invoiceId', invoiceId), filters).pipe(map((r: ApiResponse) => r.data));
  }
}
