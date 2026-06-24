import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetConfig } from '@shared/models';

@Component({
  selector: 'app-kpi-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-container">
      <div class="kpi-value">
        <span class="kpi-number">{{ formatValue(data?.metric) }}</span>
        <span class="kpi-unit">{{ widget.config?.unit }}</span>
      </div>
      
      <div *ngIf="widget.config?.comparison" class="kpi-comparison">
        <span 
          class="comparison-badge"
          [ngClass]="widget.config.comparison.trend === 'up' ? 'trend-up' : 'trend-down'">
          {{ widget.config.comparison.trend === 'up' ? '↑' : '↓' }}
          {{ widget.config.comparison.value }}%
        </span>
        <span class="comparison-label">{{ widget.config.comparison.label }}</span>
      </div>
    </div>
  `,
  styles: [`
    .kpi-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      min-height: 150px;
    }

    .kpi-value {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .kpi-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .kpi-unit {
      font-size: 1rem;
      color: #6b7280;
    }

    .kpi-comparison {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .comparison-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .trend-up {
      background: #dcfce7;
      color: #16a34a;
    }

    .trend-down {
      background: #fee2e2;
      color: #dc2626;
    }

    .comparison-label {
      color: #6b7280;
      font-size: 0.875rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiWidgetComponent {
  @Input() widget!: WidgetConfig;
  @Input() data: any;

  formatValue(value: any): string {
    if (!value) return '0';
    
    const format = this.widget.config?.format;
    
    switch (format) {
      case 'currency':
        return `$${(value / 1000).toFixed(1)}K`;
      case 'percentage':
        return `${value}%`;
      case 'number':
        return value.toLocaleString();
      default:
        return String(value);
    }
  }
}
