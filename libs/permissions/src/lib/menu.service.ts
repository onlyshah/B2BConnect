/**
 * Menu Service - Dynamic Menu Generation from Permissions
 * - Menus are NOT hardcoded
 * - Built from database configuration
 * - Automatically filtered by user permissions
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { MenuItem, MenuConfig, MenuGroup, DEFAULT_MENU_STRUCTURE } from '@shared/models';
import { RbacService } from './rbac.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:4000/api/menus';
  
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private rbacService: RbacService
  ) {}

  /**
   * Load menu configuration from database and filter by permissions
   */
  loadMenu(tenantId: string, userRole?: string): Observable<MenuItem[]> {
    return this.http
      .get<{ menu: MenuItem[] }>(`${this.apiUrl}/for-tenant`, {
        headers: { 'x-tenant-id': tenantId }
      })
      .pipe(
        map(response => this.filterMenuByPermissions(response.menu)),
        tap(menu => this.menuItemsSubject.next(menu))
      );
  }

  /**
   * Get all available menus for management
   */
  getAllMenus(tenantId: string): Observable<MenuConfig[]> {
    return this.http.get<{ menus: MenuConfig[] }>(`${this.apiUrl}`, {
      headers: { 'x-tenant-id': tenantId }
    }).pipe(
      map(response => response.menus)
    );
  }

  /**
   * Get specific menu config
   */
  getMenuConfig(menuId: string, tenantId: string): Observable<MenuConfig> {
    return this.http.get<MenuConfig>(`${this.apiUrl}/${menuId}`, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Filter menu items by user permissions
   */
  private filterMenuByPermissions(items: MenuItem[]): MenuItem[] {
    return items
      .filter(item => !item.permission || this.rbacService.hasPermission(item.permission))
      .map(item => ({
        ...item,
        children: item.children ? this.filterMenuByPermissions(item.children) : undefined
      }))
      .filter(item => {
        // Remove items with no visible children
        if (item.children && item.children.length === 0 && !item.route) {
          return false;
        }
        return true;
      });
  }

  /**
   * Get grouped menu items (for hierarchical display)
   */
  getGroupedMenu(tenantId: string): Observable<MenuGroup[]> {
    return this.menuItems$.pipe(
      map(items => this.groupMenuItems(items))
    );
  }

  /**
   * Group menu items by parent
   */
  private groupMenuItems(items: MenuItem[]): MenuGroup[] {
    const groups: MenuGroup[] = [];
    
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        groups.push({
          groupName: item.label,
          items: item.children
        });
      } else if (!item.divider) {
        groups.push({
          groupName: '',
          items: [item]
        });
      }
    });

    return groups;
  }

  /**
   * Search menu items by label
   */
  searchMenu(query: string, tenantId: string): Observable<MenuItem[]> {
    const items = this.menuItemsSubject.getValue();
    const filtered = this.searchMenuItems(items, query.toLowerCase());
    return Observable.of(filtered);
  }

  private searchMenuItems(items: MenuItem[], query: string): MenuItem[] {
    return items
      .filter(item => 
        item.label.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      )
      .map(item => ({
        ...item,
        children: item.children ? this.searchMenuItems(item.children, query) : undefined
      }));
  }

  /**
   * Create new menu configuration
   */
  createMenu(config: Partial<MenuConfig>, tenantId: string): Observable<MenuConfig> {
    return this.http.post<MenuConfig>(`${this.apiUrl}`, config, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Update menu configuration
   */
  updateMenu(menuId: string, updates: Partial<MenuConfig>, tenantId: string): Observable<MenuConfig> {
    return this.http.put<MenuConfig>(`${this.apiUrl}/${menuId}`, updates, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Add menu item
   */
  addMenuItem(menuId: string, item: MenuItem, tenantId: string): Observable<MenuConfig> {
    return this.http.post<MenuConfig>(`${this.apiUrl}/${menuId}/items`, item, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Get current menu items
   */
  getCurrentMenu(): MenuItem[] {
    return this.menuItemsSubject.getValue();
  }

  /**
   * Get menu item by id
   */
  getMenuItemById(itemId: string): MenuItem | undefined {
    const findItem = (items: MenuItem[]): MenuItem | undefined => {
      for (const item of items) {
        if (item.id === itemId) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findItem(this.menuItemsSubject.getValue());
  }

  /**
   * Get breadcrumb path for menu item
   */
  getBreadcrumbPath(itemId: string): string[] {
    const breadcrumbs: string[] = [];
    
    const findPath = (items: MenuItem[], targetId: string, path: string[] = []): boolean => {
      for (const item of items) {
        const currentPath = [...path, item.label];
        if (item.id === targetId) {
          breadcrumbs.push(...currentPath);
          return true;
        }
        if (item.children && findPath(item.children, targetId, currentPath)) {
          return true;
        }
      }
      return false;
    };

    findPath(this.menuItemsSubject.getValue(), itemId);
    return breadcrumbs;
  }
}
