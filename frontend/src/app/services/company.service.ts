import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  constructor(private apiService: ApiService) {}

  getCompanies(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.COMPANIES.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getCompany(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.COMPANIES.GET_BY_ID.replace(':companyId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createCompany(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.COMPANIES.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateCompany(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.COMPANIES.UPDATE.replace(':companyId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteCompany(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.COMPANIES.DELETE.replace(':companyId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getCompanyProfile(): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.COMPANIES.GET_PROFILE).pipe(map((r: ApiResponse) => r.data));
  }
}
