import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  constructor(private apiService: ApiService) {}

  // Registration Requests
  getRegistrationRequests(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.REGISTRATIONS.REQUESTS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getRegistrationRequest(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.REGISTRATIONS.REQUESTS.GET_BY_ID.replace(':requestId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createRegistrationRequest(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REGISTRATIONS.REQUESTS.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateRegistrationRequest(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.REGISTRATIONS.REQUESTS.UPDATE.replace(':requestId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  // Company Registration
  getCompanyRegistrations(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.REGISTRATIONS.COMPANIES.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getCompanyRegistration(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.REGISTRATIONS.COMPANIES.GET_BY_ID.replace(':companyId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  approveCompanyRegistration(id: string): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REGISTRATIONS.COMPANIES.APPROVE.replace(':companyId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  rejectCompanyRegistration(id: string, data?: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REGISTRATIONS.COMPANIES.REJECT.replace(':companyId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  // Distributor Registration
  getDistributorRegistrations(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.REGISTRATIONS.DISTRIBUTORS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getDistributorRegistration(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.REGISTRATIONS.DISTRIBUTORS.GET_BY_ID.replace(':distributorId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  approveDistributorRegistration(id: string): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REGISTRATIONS.DISTRIBUTORS.APPROVE.replace(':distributorId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  rejectDistributorRegistration(id: string, data?: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REGISTRATIONS.DISTRIBUTORS.REJECT.replace(':distributorId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  // Retailer Registration
  getRetailerRegistrations(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.REGISTRATIONS.RETAILERS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getRetailerRegistration(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.REGISTRATIONS.RETAILERS.GET_BY_ID.replace(':retailerId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  approveRetailerRegistration(id: string): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REGISTRATIONS.RETAILERS.APPROVE.replace(':retailerId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  rejectRetailerRegistration(id: string, data?: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REGISTRATIONS.RETAILERS.REJECT.replace(':retailerId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  // Salesman Registration
  getSalesmanRegistrations(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.REGISTRATIONS.SALESMEN.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getSalesmanRegistration(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.REGISTRATIONS.SALESMEN.GET_BY_ID.replace(':salesmanId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  approveSalesmanRegistration(id: string): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REGISTRATIONS.SALESMEN.APPROVE.replace(':salesmanId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  rejectSalesmanRegistration(id: string, data?: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REGISTRATIONS.SALESMEN.REJECT.replace(':salesmanId', id), data).pipe(map((r: ApiResponse) => r.data));
  }
}
