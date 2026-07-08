import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardService } from '../../../services/dashboard.service';
import { MetricCardComponent, MetricData } from '../../../shared/components/metric-card';

@Component({
  selector: 'app-distributor-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent],
  templateUrl: './distributor-analytics.html',
  styleUrls: ['./distributor-analytics.css']
})
export class DistributorAnalyticsComponent implements OnInit {
  summary: any = null;
  sales: any = null;
  inventory: any = null;
  metrics: MetricData[] = [];
  loading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      summary: this.dashboardService.getSummary().pipe(
        catchError((err) => {
          console.error('Distributor summary load failed', err);
          return of(null);
        })
      ),
      sales: this.dashboardService.getSalesPerformance().pipe(
        catchError((err) => {
          console.error('Distributor sales analytics load failed', err);
          return of(null);
        })
      ),
      inventory: this.dashboardService.getInventoryPerformance().pipe(
        catchError((err) => {
          console.error('Distributor inventory analytics load failed', err);
          return of(null);
        })
      )
    }).subscribe(({ summary, sales, inventory }) => {
      this.summary = summary || {};
      this.sales = sales || {};
      this.inventory = inventory || {};
      this.metrics = this.buildMetrics(this.summary);
      if (!this.metrics.length) {
        this.error = 'Analytics data is unavailable at the moment.';
      }
      this.loading = false;
    }, (err) => {
      console.error('Distributor analytics failed', err);
      this.error = 'Unable to load distributor analytics.';
      this.loading = false;
    });
  }

  private buildMetrics(summary: any): MetricData[] {
    return [
      { label: 'Active Retailers', value: summary.retailers?.active ?? 0, color: 'success', icon: '🏪' },
      { label: 'Pending Retailers', value: summary.retailers?.pendingApproval ?? 0, color: 'warning', icon: '⏳' },
      { label: 'Pending Orders', value: summary.orders?.pending ?? 0, color: 'warning', icon: '🛒' },
      { label: 'Delivered Orders', value: summary.orders?.delivered ?? 0, color: 'success', icon: '✅' },
      { label: 'Low Stock Items', value: summary.inventory?.lowStock ?? 0, color: 'danger', icon: '⚠️' },
      { label: 'Open Invoices', value: summary.finance?.openInvoices ?? 0, color: 'info', icon: '📄' }
    ];
  }
}
