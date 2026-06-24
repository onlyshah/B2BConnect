import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class FollowupService {
  constructor(private apiService: ApiService) {}

  getFollowups(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.FOLLOWUPS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getFollowup(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.FOLLOWUPS.GET_BY_ID.replace(':followupId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createFollowup(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.FOLLOWUPS.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateFollowup(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.FOLLOWUPS.UPDATE.replace(':followupId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteFollowup(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.FOLLOWUPS.DELETE.replace(':followupId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getFollowupsByRetailer(retailerId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.FOLLOWUPS.GET_BY_RETAILER.replace(':retailerId', retailerId), filters).pipe(map((r: ApiResponse) => r.data));
  }
}
