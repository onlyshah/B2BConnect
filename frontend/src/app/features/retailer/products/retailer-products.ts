import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductService, Product } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-products',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Products" eyebrow="catalog" description="Browse the catalog and see your recommended products at a glance.">
      <div class="module-shell">
        <ui-card title="Featured products" subtitle="Popular items for your store">
          <div class="module-list">
            <div class="module-row"><span>Daily essentials</span><strong>16 SKUs</strong></div>
            <div class="module-row"><span>Fast movers</span><strong>8 SKUs</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class RetailerProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  currentUser: any = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserSync();

    this.productService.getProducts({ limit: 40 }).pipe(
      catchError((err) => {
        console.error('Retailer products load failed', err);
        this.error = 'Unable to load products right now.';
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((products) => {
      this.products = Array.isArray(products) ? products : [];
    });
  }

  formatPrice(value: number): string {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  }

  stockStatus(product: Product): string {
    const stock = (product as any).stockOnHand ?? (product as any).stock ?? 0;
    if (stock <= 0) return 'Out of stock';
    if (stock < 10) return 'Low stock';
    return 'In stock';
  }

  routeToOrder(product: Product): string[] {
    return ['/retailer/orders/new'];
  }
}
