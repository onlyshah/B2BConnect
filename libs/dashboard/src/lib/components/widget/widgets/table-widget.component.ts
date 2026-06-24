import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetConfig } from '@shared/models';

@Component({
  selector: 'app-table-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th *ngFor="let column of columns">{{ formatColumnHeader(column) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of (data?.rows || []); let even = even" [ngClass]="{ 'even': even }">
            <td *ngFor="let column of columns">
              {{ getColumnValue(row, column) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!data?.rows || data.rows.length === 0" class="table-empty">
        <p>No data available</p>
      </div>

      <div *ngIf="data?.total" class="table-footer">
        <span>Total: {{ data.total }} items</span>
        <span *ngIf="data?.page"> | Page {{ data.page }} of {{ data.totalPages }}</span>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .data-table th {
      background: #f3f4f6;
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
    }

    .data-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .data-table tbody tr.even {
      background: #f9fafb;
    }

    .data-table tbody tr:hover {
      background: #f3f4f6;
    }

    .table-empty {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }

    .table-footer {
      padding: 0.75rem;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      font-size: 0.75rem;
      color: #6b7280;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableWidgetComponent {
  @Input() widget!: WidgetConfig;
  @Input() data: any;

  get columns(): string[] {
    return this.widget.config?.columns || [];
  }

  formatColumnHeader(column: string): string {
    return column
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  getColumnValue(row: any, column: string): any {
    return row[column] || '-';
  }
}
