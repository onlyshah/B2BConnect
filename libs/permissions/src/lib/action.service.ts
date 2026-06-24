/**
 * Action Service - Permission-Driven Dynamic Actions
 * - Actions are contextual
 * - Buttons automatically appear/disappear based on permissions
 * - No hardcoded role checks
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIAction, ContextMenu, BulkAction, PRODUCT_ACTIONS, ORDER_ACTIONS } from '@shared/models';
import { RbacService } from './rbac.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private apiUrl = 'http://localhost:4000/api/actions';

  private actionRegistry = new Map<string, UIAction[]>([
    ['product', PRODUCT_ACTIONS],
    ['order', ORDER_ACTIONS]
  ]);

  constructor(
    private http: HttpClient,
    private rbacService: RbacService
  ) {}

  /**
   * Get all available actions for a resource type
   * Automatically filtered by user permissions
   */
  getActionsForResource(resourceType: string): Observable<UIAction[]> {
    return of(this.getFilteredActions(resourceType));
  }

  /**
   * Get actions filtered by user permissions
   */
  private getFilteredActions(resourceType: string): UIAction[] {
    const actions = this.actionRegistry.get(resourceType) || [];
    
    return actions
      .filter(action => this.rbacService.hasPermission(action.permission))
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get specific action for resource
   */
  getAction(resourceType: string, actionId: string): UIAction | undefined {
    const actions = this.getFilteredActions(resourceType);
    return actions.find(a => a.id === actionId);
  }

  /**
   * Get context menu for resource
   */
  getContextMenu(resourceType: string, context?: any): Observable<ContextMenu> {
    return this.http
      .get<ContextMenu>(`${this.apiUrl}/context-menu/${resourceType}`)
      .pipe(
        map(menu => ({
          ...menu,
          actions: this.filterActionsByPermissions(menu.actions, context)
        }))
      );
  }

  /**
   * Filter actions based on permissions and context
   */
  private filterActionsByPermissions(actions: UIAction[], context?: any): UIAction[] {
    return actions
      .filter(action => {
        // Check permission
        const hasPermission = this.rbacService.hasPermission(action.permission);
        if (!hasPermission) return false;

        // Check contextual visibility
        if (action.visibleWhen && context) {
          return action.visibleWhen(context);
        }

        return true;
      })
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get bulk actions for resource
   */
  getBulkActions(resourceType: string): Observable<BulkAction[]> {
    return this.http
      .get<{ actions: BulkAction[] }>(`${this.apiUrl}/bulk-actions/${resourceType}`)
      .pipe(
        map(response => response.actions.filter(action => 
          this.rbacService.hasPermission(action.permission)
        ))
      );
  }

  /**
   * Register custom actions for a resource
   * Useful for feature modules to define their own actions
   */
  registerActions(resourceType: string, actions: UIAction[]): void {
    const existing = this.actionRegistry.get(resourceType) || [];
    this.actionRegistry.set(resourceType, [...existing, ...actions]);
  }

  /**
   * Get all registered resource types
   */
  getRegisteredResourceTypes(): string[] {
    return Array.from(this.actionRegistry.keys());
  }

  /**
   * Check if action is available for resource
   */
  hasAction(resourceType: string, actionId: string): boolean {
    const action = this.getAction(resourceType, actionId);
    return !!action;
  }

  /**
   * Execute action (used by UI components)
   */
  executeAction(action: UIAction, resourceId?: string, context?: any): any {
    if (!this.rbacService.hasPermission(action.permission)) {
      throw new Error(`No permission for action: ${action.permission}`);
    }

    switch (action.action) {
      case 'navigate':
        return action.target;
      
      case 'api-call':
        return {
          endpoint: action.endpoint?.replace(':id', resourceId || ''),
          method: action.method || 'GET',
          body: context
        };
      
      case 'custom-handler':
        // Custom handler should be implemented by consuming component
        return context;
      
      case 'open-modal':
        return { modal: true, target: action.target };
      
      case 'download':
        return { download: true, endpoint: action.endpoint };
      
      default:
        return null;
    }
  }

  /**
   * Get action by permission
   */
  getActionByPermission(permission: string, resourceType: string): UIAction | undefined {
    const actions = this.actionRegistry.get(resourceType) || [];
    return actions.find(a => a.permission === permission);
  }
}
