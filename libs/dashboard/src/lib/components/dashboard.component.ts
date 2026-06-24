/**
 * Dashboard Component - Single, Permission-Driven Dashboard
 * - ONE dashboard component for all users
 * - Widgets change based on permissions
 * - Layout adapts dynamically
 * - Standalone component
 */

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardLayout, WidgetConfig } from '@shared/models';
import { DashboardService } from '../dashboard.service';
import { WidgetComponent } from './widget/widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, WidgetComponent],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="text-3xl font-bold text-gray-900">{{ dashboard?.title }}</h1>
        <p class="mt-2 text-gray-600">{{ dashboard?.description }}</p>
        <button (click)="refreshDashboard()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Refresh
        </button>
      </div>

      <div class="dashboard-widgets" [ngClass]="'grid-cols-' + (dashboard?.gridSize?.columns || 4)">
        <app-widget 
          *ngFor="let widget of widgets; trackBy: trackByWidgetId"
          [widget]="widget"
          [tenantId]="tenantId"
        ></app-widget>
      </div>

      <div *ngIf="!widgets || widgets.length === 0" class="dashboard-empty">
        <p class="text-center text-gray-500">No widgets available for your role</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1600px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-widgets {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .grid-cols-4 {
      grid-template-columns: repeat(4, 1fr);
    }

    .grid-cols-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .grid-cols-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .grid-cols-1 {
      grid-template-columns: 1fr;
    }

    @media (max-width: 1400px) {
      .grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .grid-cols-4,
      .grid-cols-3,
      .grid-cols-2 {
        grid-template-columns: 1fr;
      }

      .dashboard-container {
        padding: 1rem;
      }
    }

    .dashboard-empty {
      padding: 3rem;
      text-align: center;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboard: DashboardLayout | null = null;
  widgets: WidgetConfig[] = [];
  tenantId: string = '';

  private destroy$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // In real app, get tenantId from auth service
    this.tenantId = localStorage.getItem('tenantId') || '';

    this.dashboardService.dashboard$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dashboard => {
        this.dashboard = dashboard;
        this.widgets = dashboard?.widgets || [];
      });

    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboard(): void {
    this.dashboardService.loadDashboard(this.tenantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  refreshDashboard(): void {
    this.dashboardService.refreshDashboard(this.tenantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  trackByWidgetId(index: number, widget: WidgetConfig): string {
    return widget.id;
  }
}
