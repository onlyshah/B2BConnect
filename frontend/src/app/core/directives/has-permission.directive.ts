import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Directive to show/hide elements based on permissions
 *
 * Usage:
 * <button *appHasPermission="'product.create'">Create Product</button>
 * <div *appHasPermission="['product.update', 'product.delete']; logic: 'any'">Edit or Delete</div>
 * <div *appHasPermission="['product.update', 'product.delete']; logic: 'all'">Update and Delete</div>
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permissions: string | string[] = [];
  private logic: 'single' | 'any' | 'all' = 'single';
  private destroy$ = new Subject<void>();

  @Input()
  set appHasPermission(permissions: string | string[]) {
    this.permissions = permissions;
    this.updateView();
  }

  @Input()
  set appHasPermissionLogic(logic: 'single' | 'any' | 'all') {
    this.logic = logic;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to permission changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const hasPermission = this.checkPermission();

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission(): boolean {
    const permArray = Array.isArray(this.permissions)
      ? this.permissions
      : [this.permissions];

    if (this.logic === 'any') {
      return permArray.some(perm => this.authService.hasPermission(perm));
    } else if (this.logic === 'all') {
      return permArray.every(perm => this.authService.hasPermission(perm));
    } else {
      return this.authService.hasPermission(permArray[0]);
    }
  }
}
