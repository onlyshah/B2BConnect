import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export interface Product {
  _id: string;
  name: string;
  sku: string;
  mrp: number;
  gst: number;
  brand?: string;
  companyId: string;
  tenantId: string;
  images?: { url: string; filename: string; uploadedAt: string }[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  getProducts(filters?: { [key: string]: any }): Observable<Product[]> {
    return this.apiService
      .get<Product[]>(API_ENDPOINTS.PRODUCTS.GET_ALL, filters)
      .pipe(map((response: ApiResponse<Product[]>) => response.data));
  }

  getProduct(id: string): Observable<Product> {
    const endpoint = API_ENDPOINTS.PRODUCTS.GET_BY_ID.replace(':productId', id);
    return this.apiService
      .get<Product>(endpoint)
      .pipe(map((response: ApiResponse<Product>) => response.data));
  }

  createProduct(product: any): Observable<Product> {
    return this.apiService
      .post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, product)
      .pipe(map((response: ApiResponse<Product>) => response.data));
  }

  updateProduct(id: string, product: any): Observable<Product> {
    const endpoint = API_ENDPOINTS.PRODUCTS.UPDATE.replace(':productId', id);
    return this.apiService
      .put<Product>(endpoint, product)
      .pipe(map((response: ApiResponse<Product>) => response.data));
  }

  deleteProduct(id: string): Observable<any> {
    const endpoint = API_ENDPOINTS.PRODUCTS.DELETE.replace(':productId', id);
    return this.apiService
      .delete(endpoint)
      .pipe(map((response: ApiResponse) => response.data));
  }

  uploadImage(productId: string, file: File): Observable<Product> {
    const endpoint = API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGE.replace(':productId', productId);
    return this.apiService.uploadFile<Product>(endpoint, file).pipe(map((res: ApiResponse<Product>) => res.data));
  }

  getCatalog(
    companyId?: string,
    distributorId?: string,
    query?: string,
    page = 1,
    limit = 20
  ): Observable<Product[]> {
    const filters: any = { page, limit };
    if (companyId) filters.company = companyId;
    if (distributorId) filters.distributor = distributorId;
    if (query) filters.q = query;
    return this.getProducts(filters);
  }
}
