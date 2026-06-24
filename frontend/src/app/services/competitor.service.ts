import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class CompetitorService {
  private apiUrl = `${API_BASE_URL}/competitor-reports`;

  constructor(private http: HttpClient) {}

  getReports(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params: filters });
  }

  getReport(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createReport(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMarketSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/market/summary`);
  }
}
