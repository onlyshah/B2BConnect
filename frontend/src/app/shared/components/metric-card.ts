import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MetricData {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercent?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: string;
}

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metric-card" [class]="'color-' + (color || 'primary')">
      <div class="metric-header">
        <h4 class="metric-label">{{ metric.label }}</h4>
        <span class="metric-icon" *ngIf="metric.icon">{{ metric.icon }}</span>
      </div>
      
      <div class="metric-value-section">
        <span class="metric-value">{{ metric.value }}</span>
        <span class="metric-unit" *ngIf="metric.unit">{{ metric.unit }}</span>
      </div>
      
      <div class="metric-trend" *ngIf="metric.trend" [class]="'trend-' + metric.trend">
        <span class="trend-arrow">
          <span *ngIf="metric.trend === 'up'">↑</span>
          <span *ngIf="metric.trend === 'down'">↓</span>
          <span *ngIf="metric.trend === 'neutral'">→</span>
        </span>
        <span class="trend-text">
          {{ metric.trendPercent || 0 }}% {{ metric.trend }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      background: var(--surface-elevated);
      box-shadow: var(--shadow-soft);
    }
    
    .metric-card:hover {
      box-shadow: var(--shadow);
      transform: translateY(-2px);
    }
    
    .color-primary { border-left: 4px solid var(--color-primary); }
    .color-success { border-left: 4px solid var(--color-success); }
    .color-warning { border-left: 4px solid var(--color-warning); }
    .color-danger { border-left: 4px solid var(--color-danger); }
    .color-info { border-left: 4px solid var(--color-info); }
    
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .metric-label {
      margin: 0;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.16em;
    }
    
    .metric-icon {
      font-size: 1.1rem;
    }
    
    .metric-value-section {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    
    .metric-value {
      font-size: 1.7rem;
      font-weight: 700;
      color: var(--text);
    }
    
    .metric-unit {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 600;
    }
    
    .metric-trend {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .trend-up {
      color: var(--color-success);
    }
    
    .trend-down {
      color: var(--color-danger);
    }
    
    .trend-neutral {
      color: var(--text-muted);
    }
    
    .trend-arrow {
      display: inline-block;
      width: 16px;
      text-align: center;
    }
  `]
})
export class MetricCardComponent {
  @Input() metric!: MetricData;
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
}
