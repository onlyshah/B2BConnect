/**
 * PRODUCTS FEATURE MODULE - Role-Agnostic
 * - ONE ProductListComponent for all roles
 * - ONE ProductDetailComponent for all roles
 * - Permissions control visibility and actions
 * - Layout adapts based on role
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:4000/api/products';
  private productsSubject = new BehaviorSubject<any[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all products (permissions filter what's visible)
   */
  getProducts(tenantId: string, filters?: any): Observable<any[]> {
    let url = this.apiUrl;
    return this.http
      .get<{ products: any[] }>(url, {
        headers: { 'x-tenant-id': tenantId },
        params: filters
      })
      .pipe(
        tap(response => this.productsSubject.next(response.products))
      )
      .pipe(
        tap(response => response.products)
      );
  }

  /**
   * Get product by ID
   */
  getProduct(id: string, tenantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Create product (requires permission)
   */
  createProduct(data: any, tenantId: string): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Update product (requires permission)
   */
  updateProduct(id: string, data: any, tenantId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Delete product (requires permission)
   */
  deleteProduct(id: string, tenantId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Publish product (requires permission)
   */
  publishProduct(id: string, tenantId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/publish`, {}, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Get product pricing (distributor-specific)
   */
  getProductPricing(id: string, tenantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/pricing`, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Get product inventory (inventory-specific)
   */
  getProductInventory(id: string, tenantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/inventory`, {
      headers: { 'x-tenant-id': tenantId }
    });
  }
}
