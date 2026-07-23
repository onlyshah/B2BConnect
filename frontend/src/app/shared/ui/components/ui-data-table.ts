import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UiDataTableColumn {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'date' | 'status';
  align?: 'left' | 'right';
  formatter?: (value: any, row: any) => string;
}

@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="ui-data-table">
      <div class="ui-data-table__header" *ngIf="title || subtitle">
        <div>
          <h3 *ngIf="title">{{ title }}</h3>
          <p *ngIf="subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <ng-container *ngIf="loading; else tableState">
        <div class="ui-data-table__empty">
          <h3>Loading data</h3>
          <p>Fetching the latest records for your workspace.</p>
        </div>
      </ng-container>

      <ng-template #tableState>
        <div class="ui-data-table__empty" *ngIf="rows.length === 0; else tableView">
          <h3>{{ emptyTitle }}</h3>
          <p>{{ emptyDescription }}</p>
        </div>
      </ng-template>

      <ng-template #tableView>
        <div class="ui-data-table__table-wrap">
          <table>
            <thead>
              <tr>
                <th *ngFor="let column of columns" [class.text-right]="column.align === 'right'">{{ column.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of rows">
                <td *ngFor="let column of columns" [class.text-right]="column.align === 'right'">
                  <ng-container [ngSwitch]="column.type || 'text'">
                    <span *ngSwitchCase="'status'" class="ui-data-table__pill">{{ resolveCellValue(row, column) }}</span>
                    <span *ngSwitchCase="'currency'">{{ resolveCellValue(row, column) | currency:'INR':'symbol':'1.0-0' }}</span>
                    <span *ngSwitchCase="'date'">{{ resolveCellValue(row, column) | date:'mediumDate' }}</span>
                    <span *ngSwitchDefault>{{ resolveCellValue(row, column) }}</span>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-template>
    </section>
  `,
  styles: [":host{display:block}.ui-data-table{display:grid;gap:16px;background:var(--surface-elevated);border:1px solid var(--border);border-radius:18px;padding:16px;box-shadow:var(--shadow)}.ui-data-table__header{display:flex;justify-content:space-between;align-items:flex-start}.ui-data-table__header h3{margin:0;font-size:1rem;color:var(--text)}.ui-data-table__header p{margin:4px 0 0;color:var(--text-muted);font-size:.9rem}.ui-data-table__empty{display:grid;gap:4px;justify-items:start;padding:24px 0}.ui-data-table__empty h3{margin:0;font-size:1rem;color:var(--text)}.ui-data-table__empty p{margin:0;color:var(--text-muted)}.ui-data-table__table-wrap{overflow:auto}.ui-data-table table{width:100%;border-collapse:collapse}.ui-data-table th,.ui-data-table td{padding:12px 10px;border-bottom:1px solid var(--border);text-align:left;white-space:nowrap}.ui-data-table th{font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted)}.ui-data-table td{font-size:.95rem;color:var(--text)}.ui-data-table__pill{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;background:rgba(99,102,241,.12);color:#4338ca;font-weight:600}.text-right{text-align:right}"]
})
export class UiDataTableComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() columns: UiDataTableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() loading = false;
  @Input() emptyTitle = 'No records';
  @Input() emptyDescription = 'No records available.';

  resolveCellValue(row: any, column: UiDataTableColumn): any {
    const rawValue = row?.[column.key];
    return column.formatter ? column.formatter(rawValue, row) : rawValue;
  }
}
