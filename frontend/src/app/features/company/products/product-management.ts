import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { ProductEditorComponent } from './product-editor';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ProductEditorComponent],
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.css']
})
export class ProductManagementComponent implements OnInit {
  products: any[] = [];
  loading = false;
  selectedProduct: any = null;
  showEditor = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
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
