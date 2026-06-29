import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/registration/registration.routes').then(m => m.registrationRoutes)
  },
  {
    path: 'company/dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['company-admin'] },
    loadChildren: () => import('./features/company/company.routes').then(m => m.companyRoutes)
  },
  {
    path: 'distributor/dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['distributor-admin'] },
    loadChildren: () => import('./features/distributor/distributor.routes').then(m => m.distributorRoutes)
  },
  {
    path: 'retailer/dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['retailer'] },
    loadChildren: () => import('./features/retailer/retailer.routes').then(m => m.retailerRoutes)
  },
  {
    path: 'salesman/dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['salesman'] },
    loadChildren: () => import('./features/salesman/salesman.routes').then(m => m.salesmanRoutes)
  },
  {
    path: 'super-admin/dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super-admin'] },
    loadChildren: () => import('./features/super-admin/super-admin.routes').then(m => m.superAdminRoutes)
  },
  {
    path: 'company',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['company-admin'] },
    loadChildren: () => import('./features/company/company.routes').then(m => m.companyRoutes)
  },
  {
    path: 'distributor',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['distributor-admin'] },
    loadChildren: () => import('./features/distributor/distributor.routes').then(m => m.distributorRoutes)
  },
  {
    path: 'retailer',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['retailer'] },
    loadChildren: () => import('./features/retailer/retailer.routes').then(m => m.retailerRoutes)
  },
  {
    path: 'salesman',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['salesman'] },
    loadChildren: () => import('./features/salesman/salesman.routes').then(m => m.salesmanRoutes)
  },
  {
    path: 'super-admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super-admin'] },
    loadChildren: () => import('./features/super-admin/super-admin.routes').then(m => m.superAdminRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductListComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-detail/product-detail').then(m => m.ProductDetailComponent)
      },
      {
        path: 'orders',
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
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'collections',
        loadComponent: () => import('./features/collections/collections').then(m => m.CollectionsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
