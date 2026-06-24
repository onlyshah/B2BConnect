import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private apiService: ApiService) {}

  getReviews(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.REVIEWS.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getReview(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.REVIEWS.GET_BY_ID.replace(':reviewId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createReview(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.REVIEWS.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateReview(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.REVIEWS.UPDATE.replace(':reviewId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteReview(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.REVIEWS.DELETE.replace(':reviewId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getReviewsByProduct(productId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT.replace(':productId', productId), filters).pipe(map((r: ApiResponse) => r.data));
  }

  getReviewsByRetailer(retailerId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.REVIEWS.GET_BY_RETAILER.replace(':retailerId', retailerId), filters).pipe(map((r: ApiResponse) => r.data));
  }
}
