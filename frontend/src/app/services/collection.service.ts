import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private apiService: ApiService) {}

  getCollections(filters?: any): Observable<any> {
    return this.apiService
      .get<any[]>(API_ENDPOINTS.COLLECTIONS.GET_ALL, filters)
      .pipe(map((response: ApiResponse<any[]>) => response.data));
  }

  getCollection(id: string): Observable<any> {
    const endpoint = API_ENDPOINTS.COLLECTIONS.GET_BY_ID.replace(':collectionId', id);
    return this.apiService
      .get<any>(endpoint)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  recordCollection(data: any): Observable<any> {
    return this.apiService
      .post<any>(API_ENDPOINTS.COLLECTIONS.CREATE, data)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  getRetailerCollections(retailerId: string): Observable<any[]> {
    const endpoint = API_ENDPOINTS.COLLECTIONS.GET_BY_RETAILER.replace(':retailerId', retailerId);
    return this.apiService
      .get<any[]>(endpoint)
      .pipe(map((response: ApiResponse<any[]>) => response.data));
  }
}
