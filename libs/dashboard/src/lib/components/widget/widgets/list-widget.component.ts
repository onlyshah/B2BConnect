import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetConfig } from '@shared/models';

@Component({
  selector: 'app-list-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-container">
      <div *ngFor="let item of (data?.items || [])" class="list-item">
        <div class="list-item-content">
          <h4 class="list-item-title">{{ item.title || item.name }}</h4>
          <p class="list-item-description">{{ item.description }}</p>
        </div>
        <div *ngIf="item.badge" class="list-item-badge" [ngClass]="'badge-' + item.badge">
          {{ item.badge }}
        </div>
      </div>

      <div *ngIf="!data?.items || data.items.length === 0" class="list-empty">
        <p>{{ widget.config?.emptyMessage || 'No items available' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      transition: background 0.2s;
    }

    .list-item:hover {
      background: #f9fafb;
    }

    .list-item:last-child {
      border-bottom: none;
    }

    .list-item-content {
      flex: 1;
    }

    .list-item-title {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
    }

    .list-item-description {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .list-item-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
      margin-left: 1rem;
    }

    .badge-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-completed {
      background: #dcfce7;
      color: #166534;
    }

    .badge-failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .list-empty {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListWidgetComponent {
  @Input() widget!: WidgetConfig;
  @Input() data: any;
}
