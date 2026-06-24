import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  constructor(private apiService: ApiService) {}

  getInvoices(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.INVOICES.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getInvoice(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.INVOICES.GET_BY_ID.replace(':invoiceId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createInvoice(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.INVOICES.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateInvoice(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.INVOICES.UPDATE.replace(':invoiceId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteInvoice(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.INVOICES.DELETE.replace(':invoiceId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  downloadPDF(id: string): Observable<Blob> {
    return this.apiService.downloadFile(API_ENDPOINTS.INVOICES.DOWNLOAD_PDF.replace(':invoiceId', id));
  }

  getInvoicesByOrder(orderId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.INVOICES.GET_BY_ORDER.replace(':orderId', orderId), filters).pipe(map((r: ApiResponse) => r.data));
  }

  markPaid(id: string, data?: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.INVOICES.MARK_PAID.replace(':invoiceId', id), data).pipe(map((r: ApiResponse) => r.data));
  }
}
