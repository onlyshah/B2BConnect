import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class SchemeService {
  constructor(private apiService: ApiService) {}

  getSchemes(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.SCHEMES.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  createScheme(payload: any): Observable<any> {
    return this.apiService.post<any>(API_ENDPOINTS.SCHEMES.CREATE, payload).pipe(map((r: ApiResponse) => r.data));
  }
}
