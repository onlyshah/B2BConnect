import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

export interface ListColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'badge' | 'action';
  sortable?: boolean;
  width?: string;
  format?: (value: any) => string;
}

export interface ListAction {
  label: string;
  icon?: string;
  action: string;
  permission?: string;
  condition?: (item: any) => boolean;
  class?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

export interface ListConfig {
  title: string;
  columns: ListColumn[];
  actions?: ListAction[];
  pageSize?: number;
  showSearch?: boolean;
  showPagination?: boolean;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  template: `
    <div class="list-container">
      <!-- List Header -->
      <div class="list-header">
        <h3 class="list-title">{{ config.title }}</h3>
        <div class="list-controls" *ngIf="config.showSearch !== false">
          <input 
            type="text" 
            class="search-box" 
            placeholder="Search..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch($event)"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredItems.length === 0">
        <span class="empty-icon">📭</span>
        <p>No items found</p>
      </div>

      <!-- Table -->
      <div class="list-table" *ngIf="!loading && filteredItems.length > 0">
        <table>
          <thead>
            <tr>
              <th 
                *ngFor="let col of config.columns" 
                [style.width]="col.width"
                [class.sortable]="col.sortable"
                (click)="col.sortable && onSort(col.key)">
                {{ col.label }}
                <span class="sort-indicator" *ngIf="col.sortable && sortBy === col.key">
                  {{ sortOrder === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th *ngIf="config.actions && config.actions.length > 0" class="actions-col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of paginatedItems" class="list-row">
              <td *ngFor="let col of config.columns" [style.width]="col.width">
                <span *ngIf="col.type !== 'badge'">
                  {{ col.format ? col.format(item[col.key]) : item[col.key] }}
                </span>
                <span *ngIf="col.type === 'badge'" [class]="'badge badge-' + item[col.key]">
                  {{ item[col.key] }}
                </span>
              </td>
              <td *ngIf="config.actions && config.actions.length > 0" class="actions-cell">
                <button 
                  *ngFor="let action of config.actions"
                  *appHasPermission="action.permission || 'view'"
                  [disabled]="action.condition && !action.condition(item)"
                  [class]="'btn-action btn-' + (action.class || 'primary')"
                  (click)="onAction.emit({action: action.action, item: item})"
                  [title]="action.label">
                  {{ action.icon || action.label }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="list-pagination" *ngIf="config.showPagination !== false && totalPages > 1">
        <button 
          class="pagination-btn" 
          [disabled]="currentPage === 1"
          (click)="currentPage = 1">
          ⟨⟨ First
        </button>
        <button 
          class="pagination-btn" 
          [disabled]="currentPage === 1"
          (click)="currentPage = currentPage - 1">
          ⟨ Prev
        </button>
        
        <div class="page-info">
          Page <strong>{{ currentPage }}</strong> of <strong>{{ totalPages }}</strong>
        </div>
        
        <button 
          class="pagination-btn" 
          [disabled]="currentPage === totalPages"
          (click)="currentPage = currentPage + 1">
          Next ⟩
        </button>
        <button 
          class="pagination-btn" 
          [disabled]="currentPage === totalPages"
          (click)="currentPage = totalPages">
          Last ⟩⟩
        </button>
      </div>
    </div>
  `,
  styles: [`
    .list-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #f9f9f9;
    }

    .list-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #212121;
    }

    .list-controls {
      position: relative;
      flex-shrink: 0;
    }

    .search-box {
      padding: 8px 12px 8px 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      width: 200px;
      transition: border-color 0.2s;
    }

    .search-box:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: #999;
    }

    .loading-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 40px;
      color: #999;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e0e0e0;
      border-top-color: #1976d2;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-icon {
      font-size: 48px;
    }

    .list-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: #f5f5f5;
      border-bottom: 2px solid #e0e0e0;
    }

    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    th.sortable {
      cursor: pointer;
      user-select: none;
      transition: background 0.2s;
    }

    th.sortable:hover {
      background: #eeeeee;
    }

    .sort-indicator {
      margin-left: 4px;
      font-size: 10px;
    }

    .actions-col {
      width: 150px;
      text-align: center;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 14px;
      color: #212121;
    }

    .list-row:hover {
      background: #f9f9f9;
    }

    .actions-cell {
      text-align: center;
      display: flex;
      gap: 4px;
      justify-content: center;
    }

    .btn-action {
      padding: 6px 10px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #1976d2;
      color: white;
    }
    .btn-primary:hover:not(:disabled) { background: #1565c0; }

    .btn-secondary {
      background: #e0e0e0;
      color: #212121;
    }
    .btn-secondary:hover:not(:disabled) { background: #bdbdbd; }

    .btn-success {
      background: #4caf50;
      color: white;
    }
    .btn-success:hover:not(:disabled) { background: #45a049; }

    .btn-danger {
      background: #f44336;
      color: white;
    }
    .btn-danger:hover:not(:disabled) { background: #da190b; }

    .btn-warning {
      background: #ff9800;
      color: white;
    }
    .btn-warning:hover:not(:disabled) { background: #f57c00; }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }

    .badge-active { background: #4caf50; }
    .badge-inactive { background: #9e9e9e; }
    .badge-pending { background: #ff9800; }
    .badge-approved { background: #4caf50; }
    .badge-rejected { background: #f44336; }
    .badge-shipped { background: #2196f3; }
    .badge-delivered { background: #4caf50; }

    .list-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid #e0e0e0;
      background: #f9f9f9;
    }

    .pagination-btn {
      padding: 8px 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #f0f0f0;
      border-color: #1976d2;
      color: #1976d2;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 13px;
      color: #666;
      margin: 0 12px;
    }
  `]
})
export class ListComponent implements OnInit {
  @Input() config!: ListConfig;
  @Input() items: any[] = [];
  @Input() loading = false;
  
  @Output() onAction = new EventEmitter<{action: string; item: any}>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onSort = new EventEmitter<{sortBy: string; order: 'asc' | 'desc'}>();
  
  searchTerm = '';
  sortBy = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 10;
  
  get filteredItems() {
    if (!this.searchTerm) return this.items;
    
    const term = this.searchTerm.toLowerCase();
    return this.items.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(term)
      )
    );
  }
  
  get totalPages() {
    return Math.ceil(this.filteredItems.length / this.pageSize) || 1;
  }
  
  get paginatedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }
  
  ngOnInit() {
    this.pageSize = this.config.pageSize || 10;
  }
  
  onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
  }
  
  onSort(key: string) {
    if (this.sortBy === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = key;
      this.sortOrder = 'asc';
    }
  }
}
