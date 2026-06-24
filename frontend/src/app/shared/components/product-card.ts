import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  template: `
    <div class="product-card">
      <div class="product-image">
        <img [src]="product.image || 'assets/placeholder.png'" [alt]="product.name" />
        <span class="status-badge" [class]="product.launchStatus">{{ product.launchStatus }}</span>
      </div>
      
      <div class="product-body">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-category">{{ product.category }}</p>
        
        <div class="product-pricing">
          <span class="price">₹{{ product.mrp | number: '1.0-2' }}</span>
          <span class="discount" *ngIf="product.discount">-{{ product.discount }}%</span>
        </div>
        
        <div class="product-info">
          <span class="info-item" *ngIf="showStock">
            <strong>Stock:</strong> {{ product.stock }}
          </span>
          <span class="info-item" *ngIf="showRating && product.rating">
            <strong>Rating:</strong> {{ product.rating }}/5
          </span>
        </div>
      </div>
      
      <div class="product-actions">
        <button 
          *appHasPermission="'view-products'" 
          class="btn-primary" 
          (click)="onView.emit(product)">
          View
        </button>
        <button 
          *appHasPermission="'edit-products'" 
          class="btn-secondary" 
          (click)="onEdit.emit(product)">
          Edit
        </button>
        <button 
          *appHasPermission="'add-to-order'" 
          class="btn-accent" 
          (click)="onAddToCart.emit(product)">
          Add
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: box-shadow 0.3s;
    }
    
    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .product-image {
      position: relative;
      width: 100%;
      height: 200px;
      background: #f5f5f5;
      overflow: hidden;
    }
    
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .status-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }
    
    .status-badge.active { background: #4caf50; }
    .status-badge.inactive { background: #9e9e9e; }
    .status-badge.discontinued { background: #f44336; }
    
    .product-body {
      flex: 1;
      padding: 16px;
    }
    
    .product-name {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 600;
      color: #212121;
    }
    
    .product-category {
      margin: 0 0 12px;
      font-size: 13px;
      color: #666;
    }
    
    .product-pricing {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .price {
      font-size: 18px;
      font-weight: bold;
      color: #1976d2;
    }
    
    .discount {
      background: #ff9800;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .product-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 13px;
      color: #555;
    }
    
    .info-item strong {
      color: #212121;
    }
    
    .product-actions {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #e0e0e0;
    }
    
    button {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    .btn-primary:hover { background: #1565c0; }
    
    .btn-secondary {
      background: #e0e0e0;
      color: #212121;
    }
    .btn-secondary:hover { background: #bdbdbd; }
    
    .btn-accent {
      background: #ff9800;
      color: white;
    }
    .btn-accent:hover { background: #f57c00; }
  `]
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() showStock = true;
  @Input() showRating = true;
  
  @Output() onView = new EventEmitter<Product>();
  @Output() onEdit = new EventEmitter<Product>();
  @Output() onAddToCart = new EventEmitter<Product>();
  
  ngOnInit() {
    if (!this.product) {
      console.warn('ProductCardComponent requires product input');
    }
  }
}
