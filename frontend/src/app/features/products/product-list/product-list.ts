import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiListToolbarComponent } from '../../../shared/ui/components/ui-list-toolbar';
import { UiDataTableComponent, UiDataTableColumn } from '../../../shared/ui/components/ui-data-table';
import { UiKpiCardComponent } from '../../../shared/ui/components/ui-kpi-card';
import { UiFormFieldComponent } from '../../../shared/ui/components/ui-form-field';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, UiButtonComponent, UiPageShellComponent, UiEmptyStateComponent, UiListToolbarComponent, UiDataTableComponent, UiKpiCardComponent, UiFormFieldComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  overviewColumns: UiDataTableColumn[] = [
    { key: 'name', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'mrp', label: 'MRP', type: 'currency', align: 'right' },
    { key: 'launchStatus', label: 'Status' }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }
}
