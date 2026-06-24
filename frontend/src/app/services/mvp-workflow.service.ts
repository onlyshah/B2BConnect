import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DashboardSummary,
  Distributor,
  DistributorProductPrice,
  InstallmentPlan,
  InventoryItem,
  Invoice,
  Retailer,
  ReturnClaim,
  SampleRequest,
  Story
} from '../models';
import { ApiService } from './api.service';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class MvpWorkflowService {
  private readonly apiBase = API_BASE_URL;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getDashboardSummary(filters: Record<string, string> = {}): Observable<DashboardSummary> {
    return this.apiService
      .get<any>(API_ENDPOINTS.DASHBOARD.GET_SUMMARY, { ...filters })
      .pipe(map((response) => (response?.data ? response.data : response) as DashboardSummary));
  }

  getDistributors(filters: Record<string, string> = {}): Observable<Distributor[]> {
    return this.http.get<Distributor[]>(`${this.apiBase}/distributors`, { params: this.params(filters) });
  }

  approveRetailer(retailerId: string, data: { status: string; category?: string; distributorId?: string; reason?: string }): Observable<Retailer> {
    return this.http.patch<Retailer>(`${this.apiBase}/retailers/${retailerId}/approval`, data);
  }

  getPrices(filters: Record<string, string> = {}): Observable<DistributorProductPrice[]> {
    return this.http.get<DistributorProductPrice[]>(`${this.apiBase}/pricing`, { params: this.params(filters) });
  }

  savePrice(data: Partial<DistributorProductPrice>): Observable<DistributorProductPrice> {
    return data._id
      ? this.http.patch<DistributorProductPrice>(`${this.apiBase}/pricing/${data._id}`, data)
      : this.http.post<DistributorProductPrice>(`${this.apiBase}/pricing`, data);
  }

  getInventory(filters: Record<string, string> = {}): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.apiBase}/inventory`, { params: this.params(filters) });
  }

  upsertInventory(data: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.apiBase}/inventory`, data);
  }

  getInvoices(filters: Record<string, string> = {}): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiBase}/invoices`, { params: this.params(filters) });
  }

  getOutstandingSummary(filters: Record<string, string> = {}): Observable<any> {
    return this.http.get(`${this.apiBase}/invoices/summary/outstanding`, { params: this.params(filters) });
  }

  getInstallments(filters: Record<string, string> = {}): Observable<InstallmentPlan[]> {
    return this.http.get<InstallmentPlan[]>(`${this.apiBase}/installments`, { params: this.params(filters) });
  }

  getSamples(filters: Record<string, string> = {}): Observable<SampleRequest[]> {
    return this.http.get<SampleRequest[]>(`${this.apiBase}/samples`, { params: this.params(filters) });
  }

  getReturns(filters: Record<string, string> = {}): Observable<ReturnClaim[]> {
    return this.http.get<ReturnClaim[]>(`${this.apiBase}/returns`, { params: this.params(filters) });
  }

  updateReturnStatus(returnId: string, status: string, resolutionNotes?: string): Observable<ReturnClaim> {
    return this.http.patch<ReturnClaim>(`${this.apiBase}/returns/${returnId}/status`, { status, resolutionNotes });
  }

  getStories(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiBase}/stories`);
  }

  private params(filters: Record<string, string>): HttpParams {
    return Object.entries(filters).reduce((params, [key, value]) => {
      return value ? params.set(key, value) : params;
    }, new HttpParams());
  }
}
