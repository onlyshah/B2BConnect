/**
 * Dashboard Service - Dynamic Widget Management
 * - Widgets are loaded from database configuration
 * - No hardcoded dashboards per role
 * - Automatically filtered by permissions
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { DashboardLayout, WidgetConfig } from '@shared/models';
import { RbacService } from '@permissions/rbac.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:4000/api/dashboards';
  
  private dashboardSubject = new BehaviorSubject<DashboardLayout | null>(null);
  public dashboard$ = this.dashboardSubject.asObservable();
  
  private widgetsSubject = new BehaviorSubject<WidgetConfig[]>([]);
  public widgets$ = this.widgetsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private rbacService: RbacService
  ) {}

  /**
   * Load dashboard configuration for current user
   * Dashboard includes only widgets user has permission to view
   */
  loadDashboard(tenantId: string): Observable<DashboardLayout> {
    return this.http
      .get<DashboardLayout>(`${this.apiUrl}/for-user`, {
        headers: { 'x-tenant-id': tenantId }
      })
      .pipe(
        map(dashboard => this.filterDashboardByPermissions(dashboard)),
        tap(dashboard => this.dashboardSubject.next(dashboard))
      );
  }

  /**
   * Get all available dashboards for tenant
   */
  getDashboards(tenantId: string): Observable<DashboardLayout[]> {
    return this.http
      .get<{ dashboards: DashboardLayout[] }>(`${this.apiUrl}`, {
        headers: { 'x-tenant-id': tenantId }
      })
      .pipe(
        map(response => response.dashboards)
      );
  }

  /**
   * Get specific dashboard by ID
   */
  getDashboard(dashboardId: string, tenantId: string): Observable<DashboardLayout> {
    return this.http
      .get<DashboardLayout>(`${this.apiUrl}/${dashboardId}`, {
        headers: { 'x-tenant-id': tenantId }
      })
      .pipe(
        map(dashboard => this.filterDashboardByPermissions(dashboard))
      );
  }

  /**
   * Filter dashboard widgets by user permissions
   */
  private filterDashboardByPermissions(dashboard: DashboardLayout): DashboardLayout {
    if (!dashboard) return dashboard;

    const filteredWidgets = dashboard.widgets.filter(widget => {
      if (!widget.permissions || widget.permissions.length === 0) {
        return true;
      }
      return this.rbacService.hasAnyPermission(widget.permissions);
    });

    return {
      ...dashboard,
      widgets: filteredWidgets.sort((a, b) => a.order - b.order)
    };
  }

  /**
   * Get widget data (called by widget components)
   */
  getWidgetData(widgetId: string, tenantId: string): Observable<any> {
    const widget = this.getWidgetConfig(widgetId);
    
    if (!widget || !widget.dataUrl) {
      return new Observable(observer => {
        observer.next({});
        observer.complete();
      });
    }

    return this.http.get(widget.dataUrl, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Get widget configuration
   */
  getWidgetConfig(widgetId: string): WidgetConfig | undefined {
    const dashboard = this.dashboardSubject.getValue();
    if (!dashboard) return undefined;
    
    return dashboard.widgets.find(w => w.id === widgetId);
  }

  /**
   * Get all widgets for dashboard
   */
  getWidgets(): WidgetConfig[] {
    return this.widgetsSubject.getValue();
  }

  /**
   * Get widgets by type
   */
  getWidgetsByType(type: string): WidgetConfig[] {
    return this.getWidgets().filter(w => w.type === type);
  }

  /**
   * Create new dashboard
   */
  createDashboard(dashboard: Partial<DashboardLayout>, tenantId: string): Observable<DashboardLayout> {
    return this.http.post<DashboardLayout>(`${this.apiUrl}`, dashboard, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Update dashboard
   */
  updateDashboard(
    dashboardId: string,
    updates: Partial<DashboardLayout>,
    tenantId: string
  ): Observable<DashboardLayout> {
    return this.http.put<DashboardLayout>(`${this.apiUrl}/${dashboardId}`, updates, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Add widget to dashboard
   */
  addWidget(dashboardId: string, widget: WidgetConfig, tenantId: string): Observable<DashboardLayout> {
    return this.http.post<DashboardLayout>(
      `${this.apiUrl}/${dashboardId}/widgets`,
      widget,
      { headers: { 'x-tenant-id': tenantId } }
    );
  }

  /**
   * Remove widget from dashboard
   */
  removeWidget(dashboardId: string, widgetId: string, tenantId: string): Observable<DashboardLayout> {
    return this.http.delete<DashboardLayout>(
      `${this.apiUrl}/${dashboardId}/widgets/${widgetId}`,
      { headers: { 'x-tenant-id': tenantId } }
    );
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(tenantId: string): Observable<DashboardLayout> {
    return this.loadDashboard(tenantId);
  }

  /**
   * Get dashboard for specific role/template
   */
  getDashboardByTemplate(template: string, tenantId: string): Observable<DashboardLayout> {
    return this.http
      .get<DashboardLayout>(`${this.apiUrl}/template/${template}`, {
        headers: { 'x-tenant-id': tenantId }
      })
      .pipe(
        map(dashboard => this.filterDashboardByPermissions(dashboard))
      );
  }
}
