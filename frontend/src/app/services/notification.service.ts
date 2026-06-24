import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private apiService: ApiService) {}

  getNotifications(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.NOTIFICATIONS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getNotification(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.NOTIFICATIONS.GET_BY_ID.replace(':notificationId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createNotification(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.NOTIFICATIONS.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateNotification(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.NOTIFICATIONS.UPDATE.replace(':notificationId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteNotification(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE.replace(':notificationId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  markRead(id: string): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ.replace(':notificationId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  markAllRead(): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ).pipe(map((r: ApiResponse) => r.data));
  }
}
