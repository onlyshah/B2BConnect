/**
 * PRODUCTS FEATURE ROUTES
 * Feature-based routing, not role-based
 */

import { Route } from '@angular/router';
import { PermissionGuard } from '@permissions';
import { ProductListComponent } from './components/product-list.component';

export const PRODUCTS_ROUTES: Route[] = [
  {
    path: '',
    component: ProductListComponent,
    canActivate: [PermissionGuard],
    data: {
      title: 'Products',
      permissions: ['product.view']
    }
  },
  {
    path: 'create',
    component: ProductListComponent, // Will be ProductCreateComponent
    canActivate: [PermissionGuard],
    data: {
      title: 'Create Product',
      permissions: ['product.create']
    }
  },
  {
    path: ':id',
    component: ProductListComponent, // Will be ProductDetailComponent
    canActivate: [PermissionGuard],
    data: {
      title: 'Product Details',
      permissions: ['product.view']
    }
  },
  {
    path: ':id/edit',
    component: ProductListComponent, // Will be ProductEditComponent
    canActivate: [PermissionGuard],
    data: {
      title: 'Edit Product',
      permissions: ['product.update']
    }
  }
];
