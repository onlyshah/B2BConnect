/**
 * ARCHITECTURE IMPLEMENTATION GUIDE
 * 
 * B2BConnect Configuration-Driven UI Architecture
 * Angular 22 + Ionic + Node.js
 * 
 * Zero Role-Based Duplication Principle
 * ====================================
 * 
 * WRONG WAY:
 * ❌ CompanyProductComponent
 * ❌ DistributorProductComponent
 * ❌ SalesmanProductComponent
 * ❌ RetailerProductComponent
 * 
 * RIGHT WAY:
 * ✅ ProductComponent (ONE component for all roles)
 * 
 * UI adapts based on permissions, not roles.
 */

/**
 * SECTION 1: PERMISSION CHECKING PATTERNS
 * ========================================
 */

// Pattern 1: Check single permission
if (this.rbacService.hasPermission('product.create')) {
  // Show create button
}

// Pattern 2: Check multiple permissions (OR - at least one)
if (this.rbacService.hasAnyPermission(['product.create', 'product.manage'])) {
  // Show button if user has ANY permission
}

// Pattern 3: Check multiple permissions (AND - all required)
if (this.rbacService.hasAllPermissions(['product.create', 'product.publish'])) {
  // Show button if user has ALL permissions
}

// Pattern 4: In templates with directive
// <button *appHasPermission="'product.create'">Create</button>
// <button *appHasPermission="['product.edit', 'product.delete']">Manage</button>

/**
 * SECTION 2: COMPONENT REUSE PATTERNS
 * ====================================
 */

// Example: ProductListComponent (ONE component, many uses)
@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <!-- Company sees: Name, BasePrice, Status -->
      <!-- Distributor sees: Name, DistributorPrice -->
      <!-- Salesman sees: Name only -->
      <!-- Retailer sees: Name, Price, Order button -->
      
      <app-data-table
        [columns]="getVisibleColumns()"
        [actions]="getAvailableActions()"
      ></app-data-table>
    </div>
  `
})
export class ProductListComponent {
  
  // Columns determined by permissions
  getVisibleColumns() {
    const columns = [
      { key: 'name', label: 'Product', visible: true }
    ];
    
    // Add columns based on PERMISSIONS
    if (this.rbac.hasPermission('product.view.pricing')) {
      columns.push({ key: 'basePrice', label: 'Price' });
    }
    if (this.rbac.hasPermission('inventory.view')) {
      columns.push({ key: 'inventory', label: 'Stock' });
    }
    if (this.rbac.hasPermission('product.order')) {
      columns.push({ key: 'actions', label: 'Order' });
    }
    
    return columns;
  }
  
  // Actions determined by permissions
  getAvailableActions() {
    return this.actionService.getActionsForResource('product');
    // Returns: Create, Edit, Delete, Publish only if user has permissions
  }
}

/**
 * SECTION 3: FEATURE MODULE PATTERN
 * ==================================
 */

// File: libs/products/src/lib/products.routes.ts
export const PRODUCTS_ROUTES: Route[] = [
  {
    path: '',
    component: ProductListComponent,
    canActivate: [PermissionGuard],
    data: { permissions: ['product.view'] }
  },
  {
    path: 'create',
    component: ProductCreateComponent,
    canActivate: [PermissionGuard],
    data: { permissions: ['product.create'] }
  },
  {
    path: ':id/edit',
    component: ProductEditComponent,
    canActivate: [PermissionGuard],
    data: { permissions: ['product.update'] }
  }
];

// Main routing: Feature-based, not role-based
export const APP_ROUTES: Route[] = [
  {
    path: 'products',
    loadChildren: () => import('@products').then(m => m.PRODUCTS_ROUTES),
    canActivate: [PermissionGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('@orders').then(m => m.ORDERS_ROUTES),
    canActivate: [PermissionGuard]
  }
];

/**
 * SECTION 4: DYNAMIC FORMS PATTERN
 * =================================
 */

// Form configuration (stored in database)
const productFormConfig: FormConfig = {
  id: 'product-form',
  title: 'Product Details',
  sections: [
    {
      name: 'basic',
      title: 'Basic Information',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' }
      ]
    },
    {
      name: 'pricing',
      title: 'Pricing',
      fields: [
        {
          name: 'basePrice',
          label: 'Base Price',
          type: 'currency',
          required: true,
          permissions: ['product.edit.pricing'] // Only visible to users with this permission
        },
        {
          name: 'wholesalePrice',
          label: 'Wholesale Price',
          type: 'currency',
          permissions: ['product.edit.pricing']
        }
      ]
    }
  ]
};

// Component (ONE form, many roles see different fields)
<app-dynamic-form
  [formConfig]="productFormConfig"
  (submitted)="onSubmit($event)">
</app-dynamic-form>

// Result:
// - Company Admin: Sees all fields
// - Distributor: Sees all except pricing fields
// - Salesman: Sees only basic fields
// - No component code changes!

/**
 * SECTION 5: DASHBOARD PATTERN
 * =============================
 */

// ONE Dashboard component for all users
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <app-widget 
        *ngFor="let widget of widgets"
        [widget]="widget">
      </app-widget>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  widgets: WidgetConfig[];
  
  ngOnInit() {
    // Load dashboard config from database
    this.dashboardService.loadDashboard(tenantId)
      .subscribe(dashboard => {
        // Automatically filters widgets by permissions
        this.widgets = dashboard.widgets;
      });
  }
}

// Result by role:
// Company Admin:
//   - Sales Analytics widget
//   - Product Performance widget
//   - Distributor Growth widget
//
// Distributor:
//   - Today's Orders widget
//   - Inventory Status widget
//   - Outstanding Payments widget
//
// No component code changes - widgets loaded from config!

/**
 * SECTION 6: DYNAMIC MENUS PATTERN
 * =================================
 */

// Menu configuration (stored in database)
const menuConfig: MenuConfig = {
  id: 'main-menu',
  items: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      permission: 'dashboard.view'
    },
    {
      id: 'products',
      label: 'Products',
      route: '/products',
      permission: 'product.view'
    },
    {
      id: 'orders',
      label: 'Orders',
      route: '/orders',
      permission: 'order.view'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      route: '/inventory',
      permission: 'inventory.view'
    }
  ]
};

// Component (ONE menu, all roles see different items)
@Component({
  selector: 'app-sidebar',
  template: `
    <nav class="sidebar">
      <a *ngFor="let item of menuItems" [routerLink]="item.route">
        {{ item.label }}
      </a>
    </nav>
  `
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[];
  
  ngOnInit() {
    // Load and auto-filter menu by permissions
    this.menuService.loadMenu(tenantId)
      .subscribe(items => {
        // Only items user has permission for are included
        this.menuItems = items;
      });
  }
}

// Result by role:
// Company Admin sees: Dashboard, Products, Orders, Inventory
// Distributor sees: Dashboard, Orders, Inventory
// Salesman sees: Dashboard, Orders
// Retailer sees: Dashboard, Products
// No component code changes!

/**
 * SECTION 7: PERMISSION-DRIVEN ACTIONS
 * =====================================
 */

// Actions configuration (stored in database)
const productActions: UIAction[] = [
  {
    id: 'create',
    label: 'Create Product',
    permission: 'product.create',
    type: 'primary',
    action: 'open-modal'
  },
  {
    id: 'edit',
    label: 'Edit',
    permission: 'product.update',
    type: 'secondary',
    action: 'open-modal'
  },
  {
    id: 'delete',
    label: 'Delete',
    permission: 'product.delete',
    type: 'danger',
    action: 'api-call'
  },
  {
    id: 'publish',
    label: 'Publish',
    permission: 'product.publish',
    type: 'success',
    action: 'api-call'
  }
];

// Get actions for user (automatically filtered by permissions)
this.actionService.getActionsForResource('product')
  .subscribe(actions => {
    // Company Admin gets: Create, Edit, Delete, Publish
    // Distributor gets: Edit (if product.update allowed)
    // Salesman gets: none (no product management permissions)
    // Retailer gets: none
    this.availableActions = actions;
  });

/**
 * SECTION 8: MULTI-TENANT ISOLATION
 * ==================================
 */

// All HTTP calls include tenant header
return this.http.get('/api/products', {
  headers: { 'x-tenant-id': this.currentTenantId }
});

// Backend validates tenant on every request
// Cannot access another tenant's data even if you know the ID

// Result: Safe multi-tenancy
// - Company A sees only its data
// - Company B sees only its data
// - Same codebase, infinite tenants

/**
 * SECTION 9: MIGRATION FROM ROLE-BASED TO PERMISSION-BASED
 * ==========================================================
 */

// OLD WAY (DON'T DO THIS):
if (user.role === 'company') {
  this.showCreateButton = true;
}

// NEW WAY (DO THIS):
this.showCreateButton = this.rbac.hasPermission('product.create');

// Why it's better:
// ✅ Granular control
// ✅ Easy to add sub-roles
// ✅ Easy to delegate permissions
// ✅ Easy to audit
// ✅ NO duplicate components
// ✅ Scales to thousands of roles

/**
 * SECTION 10: DEVELOPMENT CHECKLIST
 * ==================================
 */

// When creating a new feature:
// ✅ Create ONE component (not one per role)
// ✅ Use hasPermission() checks
// ✅ Define permissions in backend
// ✅ Use @appHasPermission directive in templates
// ✅ Use PermissionGuard on routes
// ✅ Load configuration from database (not hardcoded)
// ✅ Respect tenantId header on all API calls
// ✅ Implement audit logging for sensitive actions

// DO NOT:
// ❌ Create role-specific components
// ❌ Use hardcoded role checks
// ❌ Hardcode menus
// ❌ Hardcode forms
// ❌ Hardcode dashboards
// ❌ Forget tenantId in API calls
// ❌ Create separate routes per role

/**
 * SECTION 11: TESTING PERMISSIONS
 * ================================
 */

describe('ProductListComponent', () => {
  it('should show create button for users with product.create permission', () => {
    // Mock permission
    rbacService.hasPermission.and.returnValue(true);
    component.ngOnInit();
    expect(component.showCreateButton).toBe(true);
  });
  
  it('should hide delete button for users without product.delete permission', () => {
    rbacService.hasPermission.and.returnValue(false);
    component.ngOnInit();
    expect(component.showDeleteButton).toBe(false);
  });
  
  it('should show only allowed columns based on permissions', () => {
    rbacService.hasPermission.and.callFake((perm) => {
      return perm === 'product.view.pricing'; // Only pricing permission
    });
    component.ngOnInit();
    expect(component.visibleColumns).toContain('basePrice');
    expect(component.visibleColumns).not.toContain('inventory');
  });
});

/**
 * SECTION 12: PERFORMANCE OPTIMIZATION
 * =====================================
 */

// Cache permissions in memory
private permissionsCache: Permission[] = [];

// Lazy load features only if user has permission
{
  path: 'admin',
  loadChildren: () => import('@admin').then(m => m.ADMIN_ROUTES),
  canActivate: [PermissionGuard],
  data: { permissions: ['admin.access'] }
}

// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Virtual scrolling for large lists
<cdk-virtual-scroll-viewport itemSize="50">
  <div *cdkVirtualFor="let item of largeList"></div>
</cdk-virtual-scroll-viewport>

// Reuse components (don't create new ones per role)
// Single DataTable for all modules
// Single Form component for all forms
// Single Dashboard for all users

/**
 * End of Implementation Guide
 * ===========================
 * 
 * Key Takeaway:
 * Build ONE component with MANY permissions,
 * not MANY components with ONE role.
 * 
 * Permissions drive everything:
 * - Menu visibility
 * - Form field visibility
 * - Button visibility
 * - Column visibility
 * - Widget visibility
 * - Route access
 * - Action availability
 * 
 * Result: Scalable, maintainable, permission-driven UI
 */
