import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private apiService: ApiService) {}

  getInventory(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.INVENTORY.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getInventoryItem(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.INVENTORY.GET_BY_ID.replace(':inventoryId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createInventory(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.INVENTORY.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateInventory(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.INVENTORY.UPDATE.replace(':inventoryId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteInventory(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.INVENTORY.DELETE.replace(':inventoryId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  getInventoryByDistributor(distributorId: string, filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.INVENTORY.GET_BY_DISTRIBUTOR.replace(':distributorId', distributorId), filters).pipe(map((r: ApiResponse) => r.data));
  }

  getLowStock(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.INVENTORY.GET_LOW_STOCK, filters).pipe(map((r: ApiResponse) => r.data));
  }

  adjustStock(id: string, adjustment: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.INVENTORY.ADJUST_STOCK.replace(':inventoryId', id), adjustment).pipe(map((r: ApiResponse) => r.data));
  }
}
