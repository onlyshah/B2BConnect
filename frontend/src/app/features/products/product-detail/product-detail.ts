import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { Product } from '../../../models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, UiButtonComponent],
  template: `
    <div class="p-4">
      <ui-button variant="ghost" [routerLink]="['/dashboard/products']">← Back to catalog</ui-button>
      <div *ngIf="loading" class="mt-4">Loading product...</div>
      <div *ngIf="error" class="mt-4 text-red-600">{{ error }}</div>
      <div *ngIf="product && !loading" class="mt-4 space-y-3">
        <h2>{{ product.name }}</h2>
        <p><strong>SKU:</strong> {{ product.sku }}</p>
        <p><strong>MRP:</strong> ₹{{ product.mrp }}</p>
        <p><strong>GST:</strong> {{ product.gst }}%</p>
        <p *ngIf="product.packSize"><strong>Pack Size:</strong> {{ product.packSize }}</p>
        <p *ngIf="product.benefits?.length"><strong>Benefits:</strong> {{ product.benefits.join(', ') }}</p>
        <div class="flex gap-3 mt-4">
          <ui-button variant="primary" [routerLink]="['/dashboard/orders/new']" [queryParams]="{ productId: product._id, sku: product.sku }">Order Now</ui-button>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.error = 'Product id is missing';
        this.loading = false;
        return;
      }
      this.loadProduct(id);
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.error = null;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load product details';
        this.loading = false;
      }
    });
  }
}
