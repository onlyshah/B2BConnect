import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  constructor(private apiService: ApiService) {}

  getCampaigns(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.CAMPAIGNS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  createCampaign(payload: any): Observable<any> {
    return this.apiService.post<any>(API_ENDPOINTS.CAMPAIGNS.CREATE, payload).pipe(map((r: ApiResponse) => r.data));
  }
}
