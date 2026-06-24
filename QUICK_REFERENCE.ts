/**
 * ============================================================================
 * B2BCONNECT QUICK REFERENCE CARD
 * ============================================================================
 * 
 * Keep this handy during development.
 * Print and post on your desk!
 * 
 */

// ============================================================================
// QUICK REFERENCE: Permission Checking
// ============================================================================

import { RbacService } from '@permissions';

@Component({...})
export class MyComponent {
  constructor(private rbac: RbacService) {}

  // Check single permission
  canCreate = this.rbac.hasPermission('product.create');

  // Check multiple (OR)
  canManage = this.rbac.hasAnyPermission(['product.edit', 'product.delete']);

  // Check multiple (AND)
  canPublish = this.rbac.hasAllPermissions(['product.create', 'product.approve']);

  // Get user's roles
  roles = this.rbac.getRoles();

  // Get all permissions for module
  productPermissions = this.rbac.getModulePermissions('product');
}

// ============================================================================
// QUICK REFERENCE: Template Directives
// ============================================================================

<!-- Single permission -->
<button *appHasPermission="'product.create'">Create</button>

<!-- Multiple permissions (OR) -->
<button *appHasPermission="['product.create', 'product.manage']">
  Create or Manage
</button>

<!-- Multiple permissions (AND) -->
<button 
  *appHasPermission="['product.create', 'product.publish']"
  appHasPermissionLogic="all">
  Create & Publish
</button>

<!-- With else template -->
<button *appHasPermission="'product.delete'; else noPerms">
  Delete
</button>
<ng-template #noPerms>
  <span class="text-gray-400">Cannot delete</span>
</ng-template>

// ============================================================================
// QUICK REFERENCE: Route Guards
// ============================================================================

// Protect route with single permission
{
  path: 'products/create',
  component: ProductCreateComponent,
  canActivate: [PermissionGuard],
  data: { permissions: ['product.create'] }
}

// Protect with multiple permissions (OR)
{
  path: 'products/manage',
  component: ProductManageComponent,
  canActivate: [PermissionGuard],
  data: { permissions: ['product.edit', 'product.delete'] }
}

// Protect with multiple permissions (AND)
{
  path: 'products/publish',
  component: PublishComponent,
  canActivate: [PermissionGuard],
  data: { 
    permissions: ['product.create', 'product.approve'],
    requireAll: true
  }
}

// Multi-tenant validation
{
  path: 'tenant/:tenantId/dashboard',
  component: DashboardComponent,
  canActivate: [TenantGuard]
}

// ============================================================================
// QUICK REFERENCE: Building Columns Based on Permissions
// ============================================================================

getVisibleColumns() {
  const columns = [
    { key: 'name', label: 'Product Name' }
  ];

  // Add columns based on PERMISSIONS, not roles!
  if (this.rbac.hasPermission('product.view.pricing')) {
    columns.push({ key: 'basePrice', label: 'Price' });
  }

  if (this.rbac.hasPermission('product.view.distributor-pricing')) {
    columns.push({ key: 'distributorPrice', label: 'Distributor Price' });
  }

  if (this.rbac.hasPermission('inventory.view')) {
    columns.push({ key: 'inventory', label: 'Stock' });
  }

  return columns;
}

// ============================================================================
// QUICK REFERENCE: Building Actions Based on Permissions
// ============================================================================

getAvailableActions() {
  const actions = [];

  if (this.rbac.hasPermission('product.create')) {
    actions.push({
      id: 'create',
      label: 'Create Product',
      icon: 'plus',
      handler: () => this.navigateTo('/products/create')
    });
  }

  if (this.rbac.hasPermission('product.update')) {
    actions.push({
      id: 'edit',
      label: 'Edit',
      icon: 'pencil',
      handler: (product) => this.editProduct(product)
    });
  }

  if (this.rbac.hasPermission('product.delete')) {
    actions.push({
      id: 'delete',
      label: 'Delete',
      icon: 'trash',
      type: 'danger',
      handler: (product) => this.deleteProduct(product)
    });
  }

  return actions;
}

// ============================================================================
// QUICK REFERENCE: DO's and DON'Ts
// ============================================================================

// ❌ DON'T DO THIS
if (user.role === 'company') {
  // Company-specific code
}

if (user.role === 'distributor') {
  // Distributor-specific code
}

// ✅ DO THIS INSTEAD
if (this.rbac.hasPermission('product.create')) {
  // Anyone with this permission can see it
}

if (this.rbac.hasPermission('inventory.view')) {
  // Show inventory to anyone with permission
}

// ============================================================================
// QUICK REFERENCE: Menu Service
// ============================================================================

import { MenuService } from '@permissions';

constructor(private menuService: MenuService) {}

// Load menu (auto-filtered by permissions)
this.menuService.loadMenu(tenantId).subscribe(items => {
  this.menuItems = items;
});

// Get grouped menu
this.menuService.getGroupedMenu(tenantId).subscribe(groups => {
  this.menuGroups = groups;
});

// Search menu
this.menuService.searchMenu('orders', tenantId).subscribe(results => {
  this.searchResults = results;
});

// ============================================================================
// QUICK REFERENCE: Dashboard Service
// ============================================================================

import { DashboardService } from '@dashboard';

constructor(private dashboardService: DashboardService) {}

// Load dashboard (auto-filtered by permissions)
this.dashboardService.loadDashboard(tenantId).subscribe(dashboard => {
  this.widgets = dashboard.widgets;
});

// Get widget data
this.dashboardService.getWidgetData(widgetId, tenantId)
  .subscribe(data => {
    this.widgetData = data;
  });

// Add widget to dashboard
this.dashboardService.addWidget(dashboardId, widget, tenantId)
  .subscribe(updated => {
    // Dashboard updated
  });

// ============================================================================
// QUICK REFERENCE: Dynamic Forms
// ============================================================================

import { DynamicFormService } from '@shared';

constructor(private formService: DynamicFormService) {}

// Load form config
this.formService.getFormConfig('product-form', tenantId)
  .subscribe(config => {
    this.form = this.formService.buildFormGroup(config);
  });

// Submit form
this.formService.submitForm(formId, this.form.value, tenantId)
  .subscribe(result => {
    // Form submitted successfully
  });

// ============================================================================
// QUICK REFERENCE: Action Service
// ============================================================================

import { ActionService } from '@permissions';

constructor(private actionService: ActionService) {}

// Get actions for resource (auto-filtered by permissions)
this.actionService.getActionsForResource('product')
  .subscribe(actions => {
    this.productActions = actions;
  });

// Get context menu
this.actionService.getContextMenu('product', context)
  .subscribe(menu => {
    this.contextMenu = menu.actions;
  });

// Get bulk actions
this.actionService.getBulkActions('product')
  .subscribe(actions => {
    this.bulkActions = actions;
  });

// ============================================================================
// QUICK REFERENCE: Multi-Tenant API Calls
// ============================================================================

// ALWAYS include x-tenant-id header
return this.http.get('/api/products', {
  headers: { 'x-tenant-id': this.currentTenantId }
});

// Or use interceptor to add automatically
// See: core/http.interceptor.ts

// ============================================================================
// QUICK REFERENCE: Creating New Components
// ============================================================================

// WRONG: Create separate components per role
// ProductCompanyComponent
// ProductDistributorComponent
// ProductSalesmanComponent
// ProductRetailerComponent

// RIGHT: Create ONE component for all roles
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent]
})
export class ProductListComponent {
  columns = this.getVisibleColumns(); // Uses permissions
  actions = this.getAvailableActions(); // Uses permissions
  
  // Same component for all roles!
}

// ============================================================================
// QUICK REFERENCE: Debugging Permissions
// ============================================================================

// Log current user's permissions
console.log(this.rbac.getContext().permissions);

// Check specific permission
console.log(this.rbac.hasPermission('product.create'));

// Get all roles
console.log(this.rbac.getRoles());

// Check permission manually
const perms = this.rbac.getModulePermissions('product');
console.log(perms);

// ============================================================================
// QUICK REFERENCE: Common Permissions
// ============================================================================

// Product permissions
'product.view'           // View products
'product.create'         // Create products
'product.update'         // Edit products
'product.delete'         // Delete products
'product.publish'        // Publish products
'product.view.pricing'   // View pricing
'product.edit.pricing'   // Edit pricing

// Order permissions
'order.view'             // View orders
'order.create'           // Create orders
'order.update'           // Edit orders
'order.approve'          // Approve orders
'order.reject'           // Reject orders
'order.cancel'           // Cancel orders

// Inventory permissions
'inventory.view'         // View inventory
'inventory.edit'         // Edit inventory
'inventory.export'       // Export inventory

// Retailer permissions
'retailer.view'          // View retailers
'retailer.create'        // Create retailers
'retailer.approve'       // Approve retailers
'retailer.assign'        // Assign to salesman

// ============================================================================
// QUICK REFERENCE: Permission Module Imports
// ============================================================================

import { 
  RbacService,           // Core permission service
  MenuService,           // Dynamic menus
  ActionService,         // Permission-driven actions
  HasPermissionDirective,// *appHasPermission directive
  PermissionGuard,       // Route protection
  TenantGuard            // Multi-tenant validation
} from '@permissions';

import {
  DashboardService,      // Dashboard management
  DashboardComponent     // ONE dashboard for all
} from '@dashboard';

import {
  DynamicFormService,    // Form engine
  DynamicFormComponent,  // Dynamic form renderer
  FormFieldComponent     // Field renderer
} from '@shared/forms';

import {
  DataTableComponent,    // Reusable table
  ...                    // Other shared components
} from '@shared/components';

// ============================================================================
// END OF QUICK REFERENCE
// ============================================================================
