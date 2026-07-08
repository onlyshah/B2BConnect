import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TerritoryService {
  private _territories = new BehaviorSubject<any[]>([]);
  public territories$ = this._territories.asObservable();

  constructor(private apiService: ApiService) {}

  getTerritories(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.TERRITORIES.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  /**
   * Load territories from API and update the internal list observable.
   * Caller can subscribe to the returned observable to get the fresh list.
   */
  loadTerritories(filters?: any): Observable<any[]> {
    return this.getTerritories(filters).pipe(tap(list => this._territories.next(list)));
  }

  getTerritory(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.TERRITORIES.GET_BY_ID.replace(':territoryId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createTerritory(data: any): Observable<{ success: boolean; data: any; message?: string }> {
    const options = { headers: new HttpHeaders({ 'x-skip-loading': 'true' }) };
    return this.apiService.post(API_ENDPOINTS.TERRITORIES.CREATE, data, undefined, options).pipe(
      map((r: ApiResponse) => ({ success: r.success, data: r.data, message: r.message })),
      tap(response => {
        // when create succeeds, reload authoritative list from server to avoid shape/id mismatches
        if (response.success) {
          this.loadTerritories().subscribe({ error: () => {} });
        }
      })
    );
  }

  updateTerritory(id: string, data: any): Observable<{ success: boolean; data: any; message?: string }> {
    const options = { headers: new HttpHeaders({ 'x-skip-loading': 'true' }) };
    return this.apiService.put(API_ENDPOINTS.TERRITORIES.UPDATE.replace(':territoryId', id), data, undefined, options).pipe(
      map((r: ApiResponse) => ({ success: r.success, data: r.data, message: r.message })),
      tap(response => {
        // refresh full list to keep canonical state
        if (response.success) {
          this.loadTerritories().subscribe({ error: () => {} });
        }
      })
    );
  }

  deleteTerritory(id: string): Observable<any> {
    const options = { headers: new HttpHeaders({ 'x-skip-loading': 'true' }) };
    return this.apiService.delete(API_ENDPOINTS.TERRITORIES.DELETE.replace(':territoryId', id), undefined, options).pipe(
      map((r: ApiResponse) => r.data),
      tap(() => {
        // refresh list after delete
        this.loadTerritories().subscribe({ error: () => {} });
      })
    );
  }
}
