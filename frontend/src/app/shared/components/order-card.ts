import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order } from '../../models';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  template: `
    <div class="order-card">
      <div class="order-header">
        <div>
          <h3 class="order-id">Order #{{ order.orderNumber }}</h3>
          <p class="order-date">{{ order.createdAt | date: 'short' }}</p>
        </div>
        <span class="status-badge" [class]="'status-' + order.status">{{ order.status }}</span>
      </div>
      
      <div class="order-details">
        <div class="detail-row">
          <span class="label">Customer:</span>
          <span class="value">{{ order.retailerName || 'N/A' }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Items:</span>
          <span class="value">{{ order.items?.length || 0 }} items</span>
        </div>
        <div class="detail-row">
          <span class="label">Total:</span>
          <span class="value amount">₹{{ order.totalAmount | number: '1.0-2' }}</span>
        </div>
      </div>
      
      <div class="order-actions">
        <button 
          *appHasPermission="'view-orders'" 
          class="btn-primary" 
          (click)="onView.emit(order)">
          View
        </button>
        <button 
          *appHasPermission="'approve-orders'" 
          [disabled]="order.status === 'approved' || order.status === 'rejected'"
          class="btn-success" 
          (click)="onApprove.emit(order)">
          Approve
        </button>
        <button 
          *appHasPermission="'edit-orders'" 
          [disabled]="order.status !== 'pending'"
          class="btn-secondary" 
          (click)="onEdit.emit(order)">
          Edit
        </button>
      </div>
    </div>
  `,
  styles: [`
    .order-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: box-shadow 0.3s;
    }
    
    .order-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }
    
    .order-id {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #212121;
    }
    
    .order-date {
      margin: 4px 0 0;
      font-size: 12px;
      color: #999;
    }
    
    .status-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      color: white;
      white-space: nowrap;
    }
    
    .status-pending { background: #ff9800; }
    .status-approved { background: #4caf50; }
    .status-rejected { background: #f44336; }
    .status-shipped { background: #2196f3; }
    .status-delivered { background: #4caf50; }
    .status-cancelled { background: #9e9e9e; }
    
    .order-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 4px;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }
    
    .label {
      font-weight: 600;
      color: #666;
    }
    
    .value {
      color: #212121;
    }
    
    .value.amount {
      font-weight: bold;
      color: #1976d2;
      font-size: 14px;
    }
    
    .order-actions {
      display: flex;
      gap: 8px;
    }
    
    button {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    .btn-primary:hover:not(:disabled) { background: #1565c0; }
    
    .btn-success {
      background: #4caf50;
      color: white;
    }
    .btn-success:hover:not(:disabled) { background: #45a049; }
    
    .btn-secondary {
      background: #e0e0e0;
      color: #212121;
    }
    .btn-secondary:hover:not(:disabled) { background: #bdbdbd; }
  `]
})
export class OrderCardComponent implements OnInit {
  @Input() order!: Order;
  
  @Output() onView = new EventEmitter<Order>();
  @Output() onEdit = new EventEmitter<Order>();
  @Output() onApprove = new EventEmitter<Order>();
  
  ngOnInit() {
    if (!this.order) {
      console.warn('OrderCardComponent requires order input');
    }
  }
}
