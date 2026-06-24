import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class SampleService {
  constructor(private apiService: ApiService) {}

  getSamples(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.SAMPLES.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getSample(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.SAMPLES.GET_BY_ID.replace(':sampleId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createSample(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.SAMPLES.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateSample(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.SAMPLES.UPDATE.replace(':sampleId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteSample(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.SAMPLES.DELETE.replace(':sampleId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getSamplesByRetailer(retailerId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.SAMPLES.GET_BY_RETAILER.replace(':retailerId', retailerId), filters).pipe(map((r: ApiResponse) => r.data));
  }
}
