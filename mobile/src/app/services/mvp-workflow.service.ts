import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DistributorProductPrice, InventoryItem, Invoice, ReturnClaim, SampleRequest, Story } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MvpWorkflowService {
  private apiBase = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getStories(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiBase}/stories`);
  }

  getPrices(filters: Record<string, string> = {}): Observable<DistributorProductPrice[]> {
    return this.http.get<DistributorProductPrice[]>(`${this.apiBase}/pricing`, { params: this.params(filters) });
  }

  getInventory(filters: Record<string, string> = {}): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.apiBase}/inventory`, { params: this.params(filters) });
  }

  getInvoices(filters: Record<string, string> = {}): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiBase}/invoices`, { params: this.params(filters) });
  }

  getOutstandingSummary(filters: Record<string, string> = {}): Observable<any> {
    return this.http.get(`${this.apiBase}/invoices/summary/outstanding`, { params: this.params(filters) });
  }

  getSamples(filters: Record<string, string> = {}): Observable<SampleRequest[]> {
    return this.http.get<SampleRequest[]>(`${this.apiBase}/samples`, { params: this.params(filters) });
  }

  createSample(data: Partial<SampleRequest>): Observable<SampleRequest> {
    return this.http.post<SampleRequest>(`${this.apiBase}/samples`, data);
  }

  getReturns(filters: Record<string, string> = {}): Observable<ReturnClaim[]> {
    return this.http.get<ReturnClaim[]>(`${this.apiBase}/returns`, { params: this.params(filters) });
  }

  createReturn(data: Partial<ReturnClaim>): Observable<ReturnClaim> {
    return this.http.post<ReturnClaim>(`${this.apiBase}/returns`, data);
  }

  private params(filters: Record<string, string>): HttpParams {
    return Object.entries(filters).reduce((params, [key, value]) => {
      return value ? params.set(key, value) : params;
    }, new HttpParams());
  }
}
