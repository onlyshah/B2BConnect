/**
 * Product List Component
 * - Single component for all roles
 * - Columns, filters, and actions determined by permissions
 * - Layout adapts for desktop/mobile
 */

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RbacService, ActionService } from '@permissions';
import { DataTableComponent } from '@shared/components';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DataTableComponent],
  template: `
    <div class="product-list-container">
      <div class="list-header">
        <h1>Products</h1>
        <button 
          *appHasPermission="'product.create'"
          routerLink="create"
          class="btn btn-primary">
          Create Product
        </button>
      </div>

      <!-- Filters (permission-based) -->
      <div class="filters" [formGroup]="filterForm">
        <input
          type="text"
          placeholder="Search products..."
          formControlName="search"
          class="filter-input"
        />
        
        <select formControlName="category" class="filter-select">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>

        <!-- Show only if user has permission to filter by status -->
        <select 
          *appHasPermission="'product.view.all'"
          formControlName="status"
          class="filter-select">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
        </select>
      </div>

      <!-- Data Table -->
      <app-data-table
        [data]="products$"
        [columns]="visibleColumns"
        [bulkActions]="bulkActions"
        (rowAction)="onRowAction($event)"
      ></app-data-table>
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-input,
    .filter-select {
      padding: 0.625rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-family: inherit;
    }

    .filter-input {
      flex: 1;
      min-width: 200px;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  products$: any;
  filterForm: FormGroup;
  visibleColumns: any[] = [];
  bulkActions: any[] = [];

  constructor(
    private productService: ProductService,
    private rbacService: RbacService,
    private actionService: ActionService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    // Load products
    this.products$ = this.productService.products$;

    // Set visible columns based on permissions
    this.visibleColumns = this.getVisibleColumns();

    // Set available actions based on permissions
    this.bulkActions = this.getBulkActions();
  }

  private getVisibleColumns(): any[] {
    const baseColumns = [
      { key: 'name', label: 'Product Name', sortable: true },
      { key: 'category', label: 'Category', sortable: true }
    ];

    // Company sees pricing & inventory
    if (this.rbacService.hasPermission('product.view.pricing')) {
      baseColumns.push({ key: 'basePrice', label: 'Price', sortable: true });
    }

    // Distributors see distributor pricing
    if (this.rbacService.hasPermission('product.view.distributor-pricing')) {
      baseColumns.push({ key: 'distributorPrice', label: 'Distributor Price', sortable: true });
    }

    // Inventory team sees stock
    if (this.rbacService.hasPermission('inventory.view')) {
      baseColumns.push({ key: 'inventory', label: 'Stock', sortable: true });
    }

    return baseColumns;
  }

  private getBulkActions(): any[] {
    const actions = [];

    if (this.rbacService.hasPermission('product.delete')) {
      actions.push({
        id: 'bulk-delete',
        label: 'Delete Selected',
        permission: 'product.delete'
      });
    }

    if (this.rbacService.hasPermission('product.publish')) {
      actions.push({
        id: 'bulk-publish',
        label: 'Publish Selected',
        permission: 'product.publish'
      });
    }

    return actions;
  }

  onRowAction(event: any): void {
    const { action, row } = event;
    // Handle row actions
  }
}
