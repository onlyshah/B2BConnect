import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class TerritoryService {
  constructor(private apiService: ApiService) {}

  getTerritories(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.TERRITORIES.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getTerritory(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.TERRITORIES.GET_BY_ID.replace(':territoryId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createTerritory(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.TERRITORIES.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateTerritory(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.TERRITORIES.UPDATE.replace(':territoryId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteTerritory(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.TERRITORIES.DELETE.replace(':territoryId', id)).pipe(map((r: ApiResponse) => r.data));
  }
}
