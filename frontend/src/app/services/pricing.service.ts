import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class PricingService {
  constructor(private apiService: ApiService) {}

  getPricingRules(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.PRICING.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getPricingRule(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.PRICING.GET_BY_ID.replace(':priceId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createPricingRule(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.PRICING.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updatePricingRule(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.PRICING.UPDATE.replace(':priceId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deletePricingRule(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.PRICING.DELETE.replace(':priceId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getPricingByProduct(productId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.PRICING.GET_BY_PRODUCT.replace(':productId', productId), filters).pipe(map((r: ApiResponse) => r.data));
  }

  getPricingByDistributor(distributorId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.PRICING.GET_BY_DISTRIBUTOR.replace(':distributorId', distributorId), filters).pipe(map((r: ApiResponse) => r.data));
  }
}
