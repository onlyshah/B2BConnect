import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnalyticsService } from '../../../services/analytics.service';
import { MetricCardComponent, MetricData } from '../../../shared/components/metric-card';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';

@Component({
  selector: 'app-company-analytics',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, UiButtonComponent, UiCardComponent],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit {
  summary: any = null;
  loading = false;
  message = '';
  metrics: MetricData[] = [];
  salesLabels: string[] = [];
  salesSeries: number[] = [];
  trendPoints = '';
  salesChartMax = 1;
  inventoryItems: Array<{ label: string; stock: number; reorderLevel: number }> = [];
  chartWidth = 420;
  chartHeight = 180;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  public loadAnalytics() {
    this.loading = true;
    this.message = '';

    forkJoin({
      summary: this.analyticsService.getSummary({ page: 1, limit: 20 }).pipe(
        catchError((err) => {
          console.error('Failed to load analytics summary', err);
          this.message = 'Unable to load analytics data.';
          return of(null);
        })
      ),
      sales: this.analyticsService.getSalesAnalytics({ page: 1, limit: 10 }).pipe(
        catchError((err) => {
          console.error('Failed to load sales analytics', err);
          return of(null);
        })
      ),
      inventory: this.analyticsService.getTrendsAnalytics().pipe(
        catchError((err) => {
          console.error('Failed to load inventory analytics', err);
          return of(null);
        })
      )
    }).subscribe(({ summary, sales, inventory }) => {
      this.summary = summary || {};
      this.metrics = this.buildMetrics(this.summary);
      this.buildSalesChart(sales);
      this.buildInventoryItems(inventory);
      this.loading = false;
    });
  }

  private buildSalesChart(sales: any): void {
    const orders = Array.isArray(sales?.orders) ? sales.orders.slice(0, 6).reverse() : [];
    this.salesSeries = orders.map((order: any) => Number(order.totalAmount ?? order.total ?? 0));
    this.salesLabels = orders.map((order: any) => {
      const date = new Date(order.createdAt || order.updatedAt || order.orderDate || '');
      return isNaN(date.valueOf())
        ? `#${(order._id || '').toString().slice(0, 4)}`
        : date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    });

    if (!this.salesSeries.length) {
      this.trendPoints = '';
      this.salesChartMax = 1;
      return;
    }

    this.salesChartMax = Math.max(1, ...this.salesSeries);
    this.trendPoints = this.buildPolylinePoints(this.salesSeries);
  }

  private buildInventoryItems(inventory: any): void {
    const items = Array.isArray(inventory?.topItems) ? inventory.topItems.slice(0, 6) : [];
    this.inventoryItems = items.map((item: any, index: number) => ({
      label: item.productId?.name || item.name || `Item ${index + 1}`,
      stock: Number(item.stockOnHand ?? item.stock ?? item.quantity ?? 0),
      reorderLevel: Number(item.reorderLevel ?? item.minStock ?? 0)
    }));
  }

  private buildPolylinePoints(values: number[]): string {
    if (!values.length) {
      return '';
    }

    const maxValue = Math.max(...values, 1);
    const step = values.length === 1 ? this.chartWidth / 2 : this.chartWidth / (values.length - 1);

    return values
      .map((value, index) => {
        const x = Math.round(step * index);
        const y = Math.round(this.chartHeight - (value / maxValue) * (this.chartHeight - 28) - 12);
        return `${x},${y}`;
      })
      .join(' ');
  }

  private buildMetrics(summary: any): MetricData[] {
    return [
      { label: 'Products', value: summary.products ?? 0, icon: '📦', color: 'primary' },
      { label: 'Distributors', value: summary.distributors ?? 0, icon: '🚚', color: 'info' },
      { label: 'Retailers Active', value: summary.retailers?.active ?? 0, icon: '🏪', color: 'success' },
      { label: 'Retailers Pending', value: summary.retailers?.pendingApproval ?? 0, icon: '⏳', color: 'warning' },
      { label: 'Orders Pending', value: summary.orders?.pending ?? 0, icon: '🛒', color: 'warning' },
      { label: 'Orders Delivered', value: summary.orders?.delivered ?? 0, icon: '✅', color: 'success' },
      { label: 'Open Invoices', value: summary.finance?.openInvoices ?? 0, icon: '📄', color: 'danger' },
      { label: 'Outstanding', value: this.formatCurrency(summary.finance?.outstandingAmount ?? 0), unit: 'INR', icon: '💰', color: 'info' },
      { label: 'Low Stock Items', value: summary.inventory?.lowStock ?? 0, icon: '⚠️', color: 'danger' },
      { label: 'Pending Samples', value: summary.workflows?.pendingSamples ?? 0, icon: '📦', color: 'primary' },
      { label: 'Open Returns', value: summary.workflows?.openReturns ?? 0, icon: '↩️', color: 'warning' },
      { label: 'Stories', value: summary.discovery?.publishedStories ?? 0, icon: '📰', color: 'info' },
      { label: 'Avg Rating', value: summary.discovery?.averageRating ?? 0, icon: '⭐', color: 'success' },
      { label: 'Active Campaigns', value: summary.campaigns?.active ?? 0, icon: '📣', color: 'primary' },
      { label: 'Active Schemes', value: summary.schemes?.active ?? 0, icon: '🏷️', color: 'success' }
    ];
  }

  private formatCurrency(amount: number): string {
    return amount != null ? amount.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0';
  }
}

