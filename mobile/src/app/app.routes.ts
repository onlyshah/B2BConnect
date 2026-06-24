import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./pages/products/product-list/product-list').then(m => m.ProductListComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./pages/products/product-detail/product-detail').then(m => m.ProductDetailComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/order-list/order-list').then(m => m.OrderListComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'collections',
        loadComponent: () => import('./pages/collections/collections').then(m => m.CollectionsPage)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
