import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class RetailerService {
  constructor(private apiService: ApiService) {}

  getRetailers(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.RETAILERS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getRetailer(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.RETAILERS.GET_BY_ID.replace(':retailerId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createRetailer(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.RETAILERS.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateRetailer(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.RETAILERS.UPDATE.replace(':retailerId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteRetailer(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.RETAILERS.DELETE.replace(':retailerId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  approveRetailer(id: string): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.RETAILERS.APPROVE.replace(':retailerId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  uploadDocuments(id: string, files: File[]): Observable<any> {
    return this.apiService.uploadFiles(API_ENDPOINTS.RETAILERS.UPLOAD_DOCUMENTS.replace(':retailerId', id), files).pipe(map((r: ApiResponse) => r.data));
  }

  getRetailersByDistributor(distributorId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.RETAILERS.GET_BY_DISTRIBUTOR.replace(':distributorId', distributorId), filters).pipe(map((r: ApiResponse) => r.data));
  }
}
