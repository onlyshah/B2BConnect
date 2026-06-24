import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class RetailerScoreService {
  private apiUrl = `${API_BASE_URL}/retailer-scores`;

  constructor(private http: HttpClient) {}

  getScores(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params: filters });
  }

  getScore(retailerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/retailer/${retailerId}`);
  }

  createScore(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getHighPotentialRetailers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/potential/high`);
  }
}
