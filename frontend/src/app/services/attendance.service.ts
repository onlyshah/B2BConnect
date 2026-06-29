import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private apiService: ApiService) {}

  checkIn(salesmanId: string, location?: { latitude: number; longitude: number }): Observable<any> {
    const endpoint = `/api/attendance/${salesmanId}/check-in`;
    return this.apiService
      .post<any>(endpoint, { location })
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  checkOut(salesmanId: string, location?: { latitude: number; longitude: number }): Observable<any> {
    const endpoint = `/api/attendance/${salesmanId}/check-out`;
    return this.apiService
      .post<any>(endpoint, { location })
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  getTodayAttendance(salesmanId: string): Observable<any> {
    const endpoint = `/api/attendance/${salesmanId}/today`;
    return this.apiService
      .get<any>(endpoint)
      .pipe(map((response: ApiResponse<any>) => response.data));
  }

  getAttendanceHistory(salesmanId: string, page = 1, limit = 30): Observable<any> {
    const endpoint = `/api/attendance/${salesmanId}/history`;
    return this.apiService
      .get<any>(endpoint, { page, limit })
      .pipe(map((response: ApiResponse<any>) => response.data));
  }
}
