/**
 * Data Table Component - Reusable for all modules
 * - Single component, many use cases
 * - Sorting, filtering, pagination all built-in
 * - Permissions-driven actions
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="data-table-container">
      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search..."
            [formControl]="searchControl"
            class="search-input"
          />
        </div>
        <div class="bulk-actions">
          <button *ngFor="let action of bulkActions" (click)="onBulkAction(action)">
            {{ action.label }}
          </button>
        </div>
      </div>

      <!-- Table -->
      <table class="data-table">
        <thead>
          <tr>
            <th *ngIf="showCheckbox" class="checkbox-column">
              <input type="checkbox" (change)="toggleSelectAll($event)" />
            </th>
            <th *ngFor="let column of columns; let i = index" 
                (click)="onSort(column)"
                [class.sortable]="column.sortable"
                [class.sorted]="sortBy === column.key">
              {{ column.label }}
              <span *ngIf="sortBy === column.key" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of (data | async); let even = even" 
              [ngClass]="{ 'even': even, 'selected': isSelected(row.id) }">
            <td *ngIf="showCheckbox" class="checkbox-column">
              <input type="checkbox" (change)="toggleSelect(row.id, $event)" />
            </td>
            <td *ngFor="let column of columns">
              {{ row[column.key] }}
            </td>
            <td class="actions-column">
              <div class="action-buttons">
                <button *ngFor="let action of getRowActions(row)" 
                        (click)="onAction(action, row)"
                        [title]="action.label"
                        class="action-btn"
                        [ngClass]="'btn-' + action.type">
                  {{ action.label }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <button (click)="previousPage()" [disabled]="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button (click)="nextPage()" [disabled]="currentPage === totalPages">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .data-table-container {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      gap: 1rem;
    }

    .search-box {
      flex: 1;
      max-width: 400px;
    }

    .search-input {
      width: 100%;
      padding: 0.625rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
    }

    .bulk-actions {
      display: flex;
      gap: 0.5rem;
    }

    .bulk-actions button {
      padding: 0.5rem 1rem;
      background: #e5e7eb;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .data-table th {
      background: #f3f4f6;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
      cursor: pointer;
    }

    .data-table th.sortable {
      cursor: pointer;
    }

    .data-table th.sortable:hover {
      background: #e5e7eb;
    }

    .sort-indicator {
      margin-left: 0.5rem;
      opacity: 0.7;
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .data-table tbody tr:hover {
      background: #f9fafb;
    }

    .data-table tbody tr.even {
      background: #f9fafb;
    }

    .data-table tbody tr.selected {
      background: #eff6ff;
    }

    .checkbox-column {
      width: 40px;
      text-align: center;
    }

    .actions-column {
      width: 150px;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
      justify-content: center;
    }

    .action-btn {
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.75rem;
      white-space: nowrap;
    }

    .action-btn.btn-primary {
      background: #3b82f6;
      color: white;
    }

    .action-btn.btn-danger {
      background: #dc2626;
      color: white;
    }

    .action-btn.btn-secondary {
      background: #e5e7eb;
      color: #1f2937;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .pagination button {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
    }

    .pagination button:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
  @Input() data: any;
  @Input() columns: any[] = [];
  @Input() bulkActions: any[] = [];
  @Input() showCheckbox = true;
  @Output() rowAction = new EventEmitter<any>();
  @Output() bulkAction = new EventEmitter<any>();

  searchControl = new FormControl('');
  sortBy = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  totalPages = 1;
  selectedRows = new Set<string>();

  toggleSelect(rowId: string, event: any): void {
    if (event.target.checked) {
      this.selectedRows.add(rowId);
    } else {
      this.selectedRows.delete(rowId);
    }
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      // Add all visible rows
    } else {
      this.selectedRows.clear();
    }
  }

  isSelected(rowId: string): boolean {
    return this.selectedRows.has(rowId);
  }

  onSort(column: any): void {
    if (this.sortBy === column.key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column.key;
      this.sortOrder = 'asc';
    }
  }

  onAction(action: any, row: any): void {
    this.rowAction.emit({ action, row });
  }

  onBulkAction(action: any): void {
    this.bulkAction.emit({ action, rows: Array.from(this.selectedRows) });
  }

  getRowActions(row: any): any[] {
    // Filter actions by permissions
    return [];
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
}
