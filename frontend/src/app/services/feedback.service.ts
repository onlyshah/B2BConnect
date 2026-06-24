import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private apiService: ApiService) {}

  getFeedbacks(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.FEEDBACKS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getFeedback(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.FEEDBACKS.GET_BY_ID.replace(':feedbackId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createFeedback(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.FEEDBACKS.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateFeedback(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.FEEDBACKS.UPDATE.replace(':feedbackId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteFeedback(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.FEEDBACKS.DELETE.replace(':feedbackId', id)).pipe(map((r: ApiResponse) => r.data));
  }
}
