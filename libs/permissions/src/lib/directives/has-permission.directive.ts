/**
 * Has Permission Directive
 * Usage: *appHasPermission="'product.create'"
 * Usage with multiple: *appHasPermission="'product.create'; else noPermission"
 */

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RbacService } from '../rbac.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permission = '';
  private permissions: string[] = [];
  private logicType: 'any' | 'all' = 'any';
  private templateRef: TemplateRef<any>;
  private elseTemplateRef: TemplateRef<any> | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private viewContainer: ViewContainerRef,
    private rbacService: RbacService
  ) {}

  @Input()
  set appHasPermission(permission: string | string[]) {
    this.permissions = Array.isArray(permission) ? permission : [permission];
    this.updateView();
  }

  @Input()
  set appHasPermissionLogic(logic: 'any' | 'all') {
    this.logicType = logic;
    this.updateView();
  }

  @Input()
  set appHasPermissionElse(template: TemplateRef<any>) {
    this.elseTemplateRef = template;
    this.updateView();
  }

  ngOnInit(): void {
    this.rbacService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateView());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const hasPermission = this.logicType === 'all'
      ? this.rbacService.hasAllPermissions(this.permissions)
      : this.rbacService.hasAnyPermission(this.permissions);

    if (hasPermission) {
      this.viewContainer.clear();
      if (this.templateRef) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
      if (this.elseTemplateRef) {
        this.viewContainer.createEmbeddedView(this.elseTemplateRef);
      }
    }
  }
}

/**
 * Usage Examples:
 * 
 * Single permission:
 * <button *appHasPermission="'product.create'">Create Product</button>
 * 
 * Multiple permissions (OR):
 * <button *appHasPermission="['product.create', 'product.edit']">
 *   Manage Product
 * </button>
 * 
 * Multiple permissions (AND):
 * <button 
 *   *appHasPermission="['product.create', 'product.publish']"
 *   appHasPermissionLogic="all">
 *   Create & Publish
 * </button>
 * 
 * With else template:
 * <button *appHasPermission="'product.delete'; else noDelete">Delete</button>
 * <ng-template #noDelete>
 *   <span class="text-gray-400">Delete not allowed</span>
 * </ng-template>
 */
