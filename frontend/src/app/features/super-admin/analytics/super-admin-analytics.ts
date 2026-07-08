import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent, MetricData } from '../../../shared/components/metric-card';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-super-admin-analytics',
  standalone: true,
  imports: [CommonModule, MetricCardComponent],
  template: `
    <section class="page-card">
      <div class="title-row">
        <div>
          <p class="eyebrow">Platform metrics</p>
          <h2>Analytics</h2>
        </div>
        <button class="action-btn" type="button" (click)="loadAnalytics()" [disabled]="loading">Refresh</button>
      </div>

      <div *ngIf="loading" class="card">Loading analytics...</div>
      <div *ngIf="error" class="card error">{{ error }}</div>

      <div *ngIf="!loading && !error">
        <div class="metrics-grid">
          <app-metric-card *ngFor="let metric of metrics" [metric]="metric"></app-metric-card>
        </div>

        <div class="content-grid">
          <section class="card">
            <div class="card-header">
              <h3>Daily activity</h3>
            </div>
            <p>Total orders today</p>
            <strong>{{ ordersToday | number }}</strong>
          </section>

          <section class="card">
            <div class="card-header">
              <h3>Inventory pressure</h3>
            </div>
            <p>Low stock alerts</p>
            <strong>{{ lowStockItems }}</strong>
          </section>
        </div>
      </div>
    </section>
  `,
  styles: [`.page-card{display:flex;flex-direction:column;gap:16px;background:white;border:1px solid #e2e8f0;border-radius:18px;padding:20px;box-shadow:0 8px 30px rgba(15,23,42,.04)}.title-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;color:#64748b;margin:0 0 4px}.title-row h2{margin:0;font-size:1.2rem}.action-btn{background:#1d4ed8;color:white;border:none;padding:10px 12px;border-radius:10px;font-weight:600;cursor:pointer}.action-btn:disabled{opacity:.6;cursor:not-allowed}.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px}.content-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}.card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.muted{color:#64748b}.error{color:#dc2626}@media(max-width:760px){.title-row,.content-grid,.metrics-grid{display:grid;grid-template-columns:1fr;gap:12px}}`] 
})
export class SuperAdminAnalyticsComponent implements OnInit {
  metrics: MetricData[] = [];
  ordersToday = 0;
  lowStockItems = 0;
  loading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getSummary().subscribe({
      next: (data: any) => {
        const summary = data?.metrics ? data : { metrics: data };
        this.metrics = [
          { label: 'Products', value: summary.metrics?.totalProducts ?? 0, color: 'primary', icon: '📦' },
          { label: 'Retailers', value: summary.metrics?.totalRetailers ?? 0, color: 'info', icon: '🏪' },
          { label: 'Salesmen', value: summary.metrics?.totalSalesmen ?? 0, color: 'success', icon: '👥' },
          { label: 'Orders', value: summary.metrics?.totalOrders ?? 0, color: 'warning', icon: '🛒' }
        ];
        this.ordersToday = summary.metrics?.ordersToday ?? 0;
        this.lowStockItems = data?.lowStockItems ?? 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Super admin analytics load failed', err);
        this.error = 'Unable to load analytics data.';
        this.loading = false;
      }
    });
  }
}

