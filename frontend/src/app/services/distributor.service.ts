import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class DistributorService {
  constructor(private apiService: ApiService) {}

  getDistributors(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.DISTRIBUTORS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getDistributor(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.DISTRIBUTORS.GET_BY_ID.replace(':distributorId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createDistributor(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.DISTRIBUTORS.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateDistributor(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.DISTRIBUTORS.UPDATE.replace(':distributorId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteDistributor(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.DISTRIBUTORS.DELETE.replace(':distributorId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  approveDistributor(id: string): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.DISTRIBUTORS.APPROVE.replace(':distributorId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getDistributorsByCompany(companyId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.DISTRIBUTORS.GET_BY_COMPANY.replace(':companyId', companyId), filters).pipe(map((r: ApiResponse) => r.data));
  }

  list(params?: any): Observable<any[]> {
    return this.getDistributors(params);
  }

  approve(distributorId: string): Observable<any> {
    return this.approveDistributor(distributorId);
  }

  reject(distributorId: string, reason?: string): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.DISTRIBUTORS.REJECT.replace(':distributorId', distributorId), { reason }).pipe(map((r: ApiResponse) => r.data));
  }
}
