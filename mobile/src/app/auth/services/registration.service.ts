import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistrationResponse {
  message: string;
  applicationId: string;
  status: string;
  note?: string;
  appliedCompanies?: any[];
  selectedDistributor?: any;
}

export interface Company {
  _id: string;
  name: string;
  industry: string;
  city: string;
  state: string;
  logo?: string;
}

export interface Distributor {
  id: string;
  name: string;
  city: string;
  state: string;
  territory: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:4000/api/auth';

  constructor(private http: HttpClient) {}

  registerCompany(data: any): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/register/company`, data);
  }

  registerDistributor(data: any): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/register/distributor`, data);
  }

  registerSalesman(data: any): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/register/salesman`, data);
  }

  registerRetailer(data: any): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/register/retailer`, data);
  }

  searchCompanies(query?: string, state?: string, city?: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (query) params = params.set('query', query);
    if (state) params = params.set('state', state);
    if (city) params = params.set('city', city);

    return this.http.get<any>(`${this.apiUrl}/companies/search`, { params });
  }

  searchDistributors(latitude: number, longitude: number, state?: string, city?: string, maxDistance?: number): Observable<any> {
    let params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());

    if (state) params = params.set('state', state);
    if (city) params = params.set('city', city);
    if (maxDistance) params = params.set('maxDistance', maxDistance.toString());

    return this.http.get<any>(`${this.apiUrl}/distributors/search`, { params });
  }

  getRegistrationStatus(applicationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/registration-status/${applicationId}`);
  }
}
