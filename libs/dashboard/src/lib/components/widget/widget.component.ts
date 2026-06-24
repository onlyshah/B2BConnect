/**
 * Widget Component - Renders Any Widget Type
 * - Single component for all widget types
 * - Type determined at runtime
 * - NO separate components per widget type
 */

import { Component, Input, OnInit, ChangeDetectionStrategy, ComponentRef, ViewContainerRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetConfig, WidgetType } from '@shared/models';
import { DashboardService } from '../../dashboard.service';

// Widget type components
import { KpiWidgetComponent } from './widgets/kpi-widget.component';
import { ChartWidgetComponent } from './widgets/chart-widget.component';
import { TableWidgetComponent } from './widgets/table-widget.component';
import { ListWidgetComponent } from './widgets/list-widget.component';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [
    CommonModule,
    KpiWidgetComponent,
    ChartWidgetComponent,
    TableWidgetComponent,
    ListWidgetComponent
  ],
  template: `
    <div class="widget-container" [ngClass]="'widget-' + widget.type">
      <div class="widget-header">
        <h3 class="widget-title">{{ widget.title }}</h3>
        <div class="widget-actions">
          <button 
            *ngFor="let action of widget.actions"
            (click)="executeAction(action)"
            class="action-button"
            [title]="action.label">
            <i class="icon" [ngClass]="action.icon"></i>
          </button>
        </div>
      </div>

      <div class="widget-content">
        <!-- KPI Widget -->
        <app-kpi-widget 
          *ngIf="widget.type === 'kpi'"
          [widget]="widget"
          [data]="widgetData">
        </app-kpi-widget>

        <!-- Chart Widget -->
        <app-chart-widget 
          *ngIf="widget.type === 'chart'"
          [widget]="widget"
          [data]="widgetData">
        </app-chart-widget>

        <!-- Table Widget -->
        <app-table-widget 
          *ngIf="widget.type === 'table'"
          [widget]="widget"
          [data]="widgetData">
        </app-table-widget>

        <!-- List Widget -->
        <app-list-widget 
          *ngIf="widget.type === 'list'"
          [widget]="widget"
          [data]="widgetData">
        </app-list-widget>

        <!-- Loading State -->
        <div *ngIf="!widgetData && isLoading" class="widget-loading">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="widget-error">
          <p>Error loading widget</p>
          <button (click)="reload()" class="text-blue-600">Retry</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .widget-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .widget-container:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .widget-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .widget-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-button {
      padding: 0.5rem;
      background: transparent;
      border: none;
      color: #6b7280;
      cursor: pointer;
      border-radius: 0.375rem;
      transition: all 0.2s;
    }

    .action-button:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .widget-content {
      min-height: 200px;
    }

    .widget-loading,
    .widget-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #6b7280;
    }

    .spinner {
      width: 2rem;
      height: 2rem;
      border: 3px solid #e5e7eb;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 0.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .widget-error {
      color: #dc2626;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent implements OnInit {
  @Input() widget!: WidgetConfig;
  @Input() tenantId!: string;

  widgetData: any;
  isLoading = false;
  error = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (!this.widget.dataUrl) {
      this.widgetData = {};
      return;
    }

    this.isLoading = true;
    this.error = false;

    this.dashboardService.getWidgetData(this.widget.id, this.tenantId).subscribe({
      next: (data) => {
        this.widgetData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Widget data error:', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  executeAction(action: any): void {
    if (action.action === 'navigate') {
      // Navigate using router
    } else if (action.action === 'api-call') {
      // Call API
    }
  }

  reload(): void {
    this.loadData();
  }
}
