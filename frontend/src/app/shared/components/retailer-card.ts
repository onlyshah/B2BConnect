import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Retailer } from '../../models';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

@Component({
  selector: 'app-retailer-card',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  template: `
    <div class="retailer-card">
      <div class="retailer-header">
        <div class="retailer-avatar">
          <img [src]="retailer.logo || 'assets/default-avatar.png'" [alt]="retailer.name" />
        </div>
        <div class="retailer-info">
          <h3 class="retailer-name">{{ retailer.name }}</h3>
          <p class="retailer-type">{{ retailer.type }}</p>
          <p class="retailer-location">{{ retailer.city }}, {{ retailer.state }}</p>
        </div>
        <span class="approval-badge" [class]="retailer.approvalStatus">
          {{ retailer.approvalStatus }}
        </span>
      </div>
      
      <div class="retailer-stats">
        <div class="stat">
          <span class="stat-value">{{ retailer.orderCount || 0 }}</span>
          <span class="stat-label">Orders</span>
        </div>
        <div class="stat">
          <span class="stat-value">₹{{ retailer.totalSpent | number: '1.0-0' }}</span>
          <span class="stat-label">Total Spent</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ retailer.score || 0 }}/100</span>
          <span class="stat-label">Score</span>
        </div>
      </div>
      
      <div class="retailer-actions">
        <button 
          *appHasPermission="'view-retailers'" 
          class="btn-primary" 
          (click)="onView.emit(retailer)">
          View
        </button>
        <button 
          *appHasPermission="'approve-retailers'" 
          [disabled]="retailer.approvalStatus !== 'pending'"
          class="btn-success" 
          (click)="onApprove.emit(retailer)">
          Approve
        </button>
        <button 
          *appHasPermission="'edit-retailers'" 
          class="btn-secondary" 
          (click)="onEdit.emit(retailer)">
          Edit
        </button>
      </div>
    </div>
  `,
  styles: [`
    .retailer-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: box-shadow 0.3s;
    }
    
    .retailer-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .retailer-header {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    
    .retailer-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      background: #f0f0f0;
      flex-shrink: 0;
    }
    
    .retailer-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .retailer-info {
      flex: 1;
      min-width: 0;
    }
    
    .retailer-name {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 600;
      color: #212121;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .retailer-type {
      margin: 0;
      font-size: 12px;
      color: #666;
    }
    
    .retailer-location {
      margin: 4px 0 0;
      font-size: 12px;
      color: #999;
    }
    
    .approval-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      color: white;
      white-space: nowrap;
    }
    
    .approval-badge.approved { background: #4caf50; }
    .approval-badge.rejected { background: #f44336; }
    .approval-badge.pending { background: #ff9800; }
    
    .retailer-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 4px;
      text-align: center;
    }
    
    .stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .stat-value {
      font-size: 16px;
      font-weight: bold;
      color: #1976d2;
    }
    
    .stat-label {
      font-size: 11px;
      color: #666;
    }
    
    .retailer-actions {
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
export class RetailerCardComponent implements OnInit {
  @Input() retailer!: Retailer;
  
  @Output() onView = new EventEmitter<Retailer>();
  @Output() onEdit = new EventEmitter<Retailer>();
  @Output() onApprove = new EventEmitter<Retailer>();
  
  ngOnInit() {
    if (!this.retailer) {
      console.warn('RetailerCardComponent requires retailer input');
    }
  }
}
