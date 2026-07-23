import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { WORKSPACE_ROUTE_PATHS } from './core/constants/workspace-routes';

export const appRoutes: Routes = [
  { path: '', redirectTo: WORKSPACE_ROUTE_PATHS.login, pathMatch: 'full' },
  {
    path: WORKSPACE_ROUTE_PATHS.login,
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: WORKSPACE_ROUTE_PATHS.register,
    loadChildren: () => import('./auth/registration/registration.routes').then(m => m.registrationRoutes)
  },
  {
    path: WORKSPACE_ROUTE_PATHS.company,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['company-admin'] },
    loadChildren: () => import('./features/company/company.routes').then(m => m.companyRoutes)
  },
  {
    path: WORKSPACE_ROUTE_PATHS.distributor,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['distributor-admin'] },
    loadChildren: () => import('./features/distributor/distributor.routes').then(m => m.distributorRoutes)
  },
  {
    path: WORKSPACE_ROUTE_PATHS.retailer,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['retailer'] },
    loadChildren: () => import('./features/retailer/retailer.routes').then(m => m.retailerRoutes)
  },
  {
    path: WORKSPACE_ROUTE_PATHS.salesman,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['salesman'] },
    loadChildren: () => import('./features/salesman/salesman.routes').then(m => m.salesmanRoutes)
  },
  {
    path: WORKSPACE_ROUTE_PATHS.superAdmin,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super-admin'] },
    loadChildren: () => import('./features/super-admin/super-admin.routes').then(m => m.superAdminRoutes)
  },
  {
    path: WORKSPACE_ROUTE_PATHS.dashboard,
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
    children: [
      {
        path: WORKSPACE_ROUTE_PATHS.products,
        loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductListComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-detail/product-detail').then(m => m.ProductDetailComponent)
      },
      {
        path: WORKSPACE_ROUTE_PATHS.orders,
        loadComponent: () => import('./features/orders/order-list/order-list').then(m => m.OrderListComponent)
      },
      {
        path: 'orders/new',
        loadComponent: () => import('./features/orders/order-create/order-create').then(m => m.OrderCreateComponent)
      },
      {
        path: 'samples',
        loadComponent: () => import('./features/samples/sample-list/sample-list').then(m => m.SampleListComponent)
      },
      {
        path: WORKSPACE_ROUTE_PATHS.profile,
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: WORKSPACE_ROUTE_PATHS.collections,
        loadComponent: () => import('./features/collections/collections').then(m => m.CollectionsComponent)
      }
    ]
  },
  { path: '**', redirectTo: WORKSPACE_ROUTE_PATHS.login }
];
