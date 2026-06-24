/**
 * PERMISSIONS MODULE - Core RBAC Setup
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Services
import { RbacService } from './rbac.service';
import { MenuService } from './menu.service';
import { ActionService } from './action.service';

// Directives & Guards
import { HasPermissionDirective } from './directives/has-permission.directive';
import { PermissionGuard } from './guards/permission.guard';
import { TenantGuard } from './guards/tenant.guard';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [HasPermissionDirective],
  providers: [RbacService, MenuService, ActionService, PermissionGuard, TenantGuard],
  exports: [HasPermissionDirective]
})
export class PermissionsModule {}

export { RbacService, MenuService, ActionService };
export { HasPermissionDirective };
export { PermissionGuard, TenantGuard };
