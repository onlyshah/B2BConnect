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
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.3s;
      background: white;
    }
    
    .metric-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    
    .color-primary { border-left: 4px solid #1976d2; }
    .color-success { border-left: 4px solid #4caf50; }
    .color-warning { border-left: 4px solid #ff9800; }
    .color-danger { border-left: 4px solid #f44336; }
    .color-info { border-left: 4px solid #2196f3; }
    
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .metric-label {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .metric-icon {
      font-size: 20px;
    }
    
    .metric-value-section {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    
    .metric-value {
      font-size: 32px;
      font-weight: bold;
      color: #212121;
    }
    
    .metric-unit {
      font-size: 14px;
      color: #999;
      font-weight: 500;
    }
    
    .metric-trend {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .trend-up {
      color: #4caf50;
    }
    
    .trend-down {
      color: #f44336;
    }
    
    .trend-neutral {
      color: #999;
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
