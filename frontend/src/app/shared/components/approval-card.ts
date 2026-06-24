import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

export interface ApprovalItem {
  id: string;
  type: 'retailer' | 'order' | 'distributor' | 'company' | 'product';
  title: string;
  description?: string;
  submittedBy: string;
  submittedAt: Date;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  metadata?: Record<string, any>;
}

@Component({
  selector: 'app-approval-card',
  standalone: true,
  imports: [CommonModule, HasPermissionDirective],
  template: `
    <div class="approval-card" [class]="'type-' + item.type">
      <div class="approval-header">
        <div>
          <span class="type-badge" [class]="'badge-' + item.type">{{ item.type }}</span>
          <h3 class="approval-title">{{ item.title }}</h3>
          <p class="approval-desc" *ngIf="item.description">{{ item.description }}</p>
        </div>
        <span class="status-badge" [class]="'status-' + item.status">{{ item.status }}</span>
      </div>
      
      <div class="approval-info">
        <div class="info-row">
          <span class="label">Submitted by:</span>
          <span class="value">{{ item.submittedBy }}</span>
        </div>
        <div class="info-row">
          <span class="label">Date:</span>
          <span class="value">{{ item.submittedAt | date: 'medium' }}</span>
        </div>
        <div class="info-row" *ngIf="item.reason">
          <span class="label">Reason:</span>
          <span class="value">{{ item.reason }}</span>
        </div>
      </div>
      
      <div class="approval-actions" *ngIf="item.status === 'pending'">
        <button 
          *appHasPermission="'approve-' + item.type" 
          class="btn-approve" 
          (click)="onApprove.emit(item)">
          ✓ Approve
        </button>
        <button 
          *appHasPermission="'reject-' + item.type" 
          class="btn-reject" 
          (click)="onReject.emit(item)">
          ✗ Reject
        </button>
        <button 
          *appHasPermission="'view-' + item.type" 
          class="btn-view" 
          (click)="onView.emit(item)">
          View Details
        </button>
      </div>
      
      <div class="approval-actions" *ngIf="item.status !== 'pending'">
        <button class="btn-view" (click)="onView.emit(item)">
          View Details
        </button>
      </div>
    </div>
  `,
  styles: [`
    .approval-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.3s;
    }
    
    .approval-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .type-retailer { border-left: 4px solid #2196f3; }
    .type-order { border-left: 4px solid #ff9800; }
    .type-distributor { border-left: 4px solid #9c27b0; }
    .type-company { border-left: 4px solid #009688; }
    .type-product { border-left: 4px solid #e91e63; }
    
    .approval-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }
    
    .type-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      color: white;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    
    .badge-retailer { background: #2196f3; }
    .badge-order { background: #ff9800; }
    .badge-distributor { background: #9c27b0; }
    .badge-company { background: #009688; }
    .badge-product { background: #e91e63; }
    
    .approval-title {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 600;
      color: #212121;
    }
    
    .approval-desc {
      margin: 4px 0 0;
      font-size: 13px;
      color: #666;
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
    
    .approval-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 4px;
      font-size: 13px;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    
    .label {
      font-weight: 600;
      color: #666;
      min-width: 100px;
    }
    
    .value {
      color: #212121;
      flex: 1;
      text-align: right;
    }
    
    .approval-actions {
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
    
    .btn-approve {
      background: #4caf50;
      color: white;
    }
    .btn-approve:hover { background: #45a049; }
    
    .btn-reject {
      background: #f44336;
      color: white;
    }
    .btn-reject:hover { background: #da190b; }
    
    .btn-view {
      background: #e0e0e0;
      color: #212121;
    }
    .btn-view:hover { background: #bdbdbd; }
  `]
})
export class ApprovalCardComponent implements OnInit {
  @Input() item!: ApprovalItem;
  
  @Output() onView = new EventEmitter<ApprovalItem>();
  @Output() onApprove = new EventEmitter<ApprovalItem>();
  @Output() onReject = new EventEmitter<ApprovalItem>();
  
  ngOnInit() {
    if (!this.item) {
      console.warn('ApprovalCardComponent requires item input');
    }
  }
}
