import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ProductEditorComponent } from './product-editor';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { filter, takeUntil } from 'rxjs/operators';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductEditorComponent, UiButtonComponent, UiCardComponent, UiEmptyStateComponent, UiPageShellComponent],
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.css']
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  products: any[] = [];
  loading = false;
  selectedProduct: any = null;
  showEditor = false;

  constructor(private productService: ProductService, private authService: AuthService) {}

  ngOnInit() {
    // Try to load immediately (in case auth already set)
    this.loadProducts();

    // Also reload when auth becomes available to ensure requests have token
    this.authService.currentUser$
      .pipe(filter(user => !!user), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadProducts();
      });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts({ page: 1, limit: 20 }).subscribe({
      next: (data: any[]) => {
        this.products = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.loading = false;
      }
    });
  }
  private destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    this.showEditor = true;
  }

  createProduct() {
    this.selectedProduct = null;
    this.showEditor = true;
  }

  onSaved() {
    this.showEditor = false;
    this.loadProducts();
  }
}
