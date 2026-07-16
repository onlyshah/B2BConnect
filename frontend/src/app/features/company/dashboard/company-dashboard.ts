import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { DashboardSummary } from '../../../models';
import { AnalyticsService } from '../../../services/analytics.service';
import { AuthService } from '../../../services/auth.service';
import { RetailerService } from '../../../services/retailer.service';
import { DistributorService } from '../../../services/distributor.service';
import { OrderService } from '../../../services/order.service';
import { InventoryService } from '../../../services/inventory.service';
import { UiBadgeComponent } from '../../../shared/ui/components/ui-badge';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiStatCardComponent } from '../../../shared/ui/components/ui-stat-card';

const emptySummary: DashboardSummary = {
  products: 0,
  distributors: 0,
  retailers: { active: 0, pendingApproval: 0 },
  orders: { pending: 0, delivered: 0 },
  finance: { openInvoices: 0, outstandingAmount: 0 },
  inventory: { lowStock: 0 },
  workflows: { pendingSamples: 0, openReturns: 0 },
  discovery: { publishedStories: 0, averageRating: 0 },
  campaigns: { active: 0 },
  schemes: { active: 0 },
} as DashboardSummary;

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, UiBadgeComponent, UiButtonComponent, UiCardComponent, UiStatCardComponent],
  templateUrl: './company-dashboard.html',
  styleUrls: ['./company-dashboard.css']
})
export class CompanyDashboardComponent implements OnInit, OnDestroy {
  summary: DashboardSummary | null = null;
  metrics: Array<{ label: string; value: string | number; trend?: string; trendType?: 'positive' | 'negative' | 'neutral'; icon?: string; color?: string }> = [];
  pendingRetailers: any[] = [];
  lowStockItems: any[] = [];
  inventoryItems: Array<{ label: string; stock: number; reorderLevel: number }> = [];
  salesLabels: string[] = [];
  salesSeries: number[] = [];
  trendPoints = '';
  salesChartMax = 1;
  loading = true;
  error: string | null = null;
  chartWidth = 420;
  chartHeight = 180;

  private destroy$ = new Subject<void>();

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private retailerService: RetailerService,
    private distributorService: DistributorService,
    private orderService: OrderService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    const companyId = this.authService.getCurrentUserSync()?.companyId;
    const filters: Record<string, string> = companyId ? { companyId } : {};

    forkJoin({
      summary: this.analyticsService.getSummary(filters).pipe(
        catchError((err) => {
          console.error('Company analytics summary failed', err);
          return of(emptySummary);
        })
      ),
      sales: this.analyticsService.getSalesAnalytics(filters).pipe(
        catchError((err) => {
          console.error('Company sales analytics failed', err);
          return of(null);
        })
      ),
      inventory: this.analyticsService.getTrendsAnalytics(filters).pipe(
        catchError((err) => {
          console.error('Company inventory analytics failed', err);
          return of(null);
        })
      ),
      retailers: this.retailerService.getRetailers(filters).pipe(
        catchError((err) => {
          console.error('Company retailers load failed', err);
          return of([]);
        })
      ),
      distributors: this.distributorService.getDistributors(filters).pipe(
        catchError((err) => {
          console.error('Company distributors load failed', err);
          return of([]);
        })
      ),
      orders: this.orderService.getOrders(filters).pipe(
        catchError((err) => {
          console.error('Company orders load failed', err);
          return of([]);
        })
      ),
      inventoryList: this.inventoryService.getInventory(filters).pipe(
        catchError((err) => {
          console.error('Company inventory load failed', err);
          return of([]);
        })
      )
    })
      .pipe(takeUntil(this.destroy$), finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ summary, sales, inventory, retailers, distributors, orders, inventoryList }) => {
          this.summary = this.normalizeSummary(summary);
          const retailerList = this.toArray(retailers);
          const orderList = this.toArray(orders);
          const inventoryListData = this.toArray(inventoryList);

          this.pendingRetailers = retailerList
            .filter((item: any) => ['pending', 'requested', 'submitted', 'review', 'in_review', 'under_review'].includes((item.status || '').toLowerCase()))
            .slice(0, 5);

          this.lowStockItems = inventoryListData
            .filter((item: any) => (item.stockOnHand ?? item.stock ?? item.quantity ?? 0) <= (item.reorderLevel ?? item.minStock ?? 0))
            .slice(0, 5);

          this.metrics = this.buildMetrics(this.summary, distributorCount(distributors));
          this.buildSalesChart(sales);
          this.buildInventoryItems(inventory);
          this.error = null;
        },
        error: (err) => {
          console.error('Company dashboard load failed', err);
          this.summary = emptySummary;
          this.metrics = [];
          this.pendingRetailers = [];
          this.lowStockItems = [];
          this.inventoryItems = [];
          this.salesLabels = [];
          this.salesSeries = [];
          this.trendPoints = '';
          this.error = 'Unable to load company overview right now.';
        }
      });
  }

  private toArray(value: any): any[] {
    if (Array.isArray(value)) {
      return value;
    }

    if (Array.isArray(value?.data)) {
      return value.data;
    }

    return [];
  }

  private normalizeSummary(summary: any): DashboardSummary {
    if (!summary || typeof summary !== 'object') {
      return emptySummary;
    }

    return {
      ...emptySummary,
      ...summary,
      retailers: {
        active: summary?.retailers?.active ?? summary?.retailers?.activeCount ?? 0,
        pendingApproval: summary?.retailers?.pendingApproval ?? summary?.retailers?.pending ?? 0,
      },
      orders: {
        pending: summary?.orders?.pending ?? 0,
        delivered: summary?.orders?.delivered ?? 0,
      },
      finance: {
        openInvoices: summary?.finance?.openInvoices ?? 0,
        outstandingAmount: summary?.finance?.outstandingAmount ?? 0,
      },
      inventory: {
        lowStock: summary?.inventory?.lowStock ?? 0,
      },
      workflows: {
        pendingSamples: summary?.workflows?.pendingSamples ?? 0,
        openReturns: summary?.workflows?.openReturns ?? 0,
      },
      discovery: {
        publishedStories: summary?.discovery?.publishedStories ?? 0,
        averageRating: summary?.discovery?.averageRating ?? 0,
      },
      campaigns: {
        active: summary?.campaigns?.active ?? 0,
      },
      schemes: {
        active: summary?.schemes?.active ?? 0,
      },
    } as DashboardSummary;
  }

  private buildMetrics(summary: DashboardSummary, distributors: number): Array<{ label: string; value: string | number; trend?: string; trendType?: 'positive' | 'negative' | 'neutral'; icon?: string; color?: string }> {
    return [
      { label: 'Products', value: summary.products || 0, trend: 'Live', trendType: 'positive', color: 'primary', icon: '📦' },
      { label: 'Distributors', value: distributors || summary.distributors || 0, trend: 'Active', trendType: 'positive', color: 'info', icon: '🚚' },
      { label: 'Active Retailers', value: summary.retailers?.active || 0, trend: 'Onboarded', trendType: 'positive', color: 'success', icon: '🏪' },
      { label: 'Retailers Pending', value: summary.retailers?.pendingApproval || 0, trend: 'Needs review', trendType: 'negative', color: 'warning', icon: '⏳' },
      { label: 'Orders Pending', value: summary.orders?.pending || 0, trend: 'In queue', trendType: 'neutral', color: 'warning', icon: '🛒' },
      { label: 'Low Stock Items', value: summary.inventory?.lowStock || 0, trend: 'Watchlist', trendType: 'negative', color: 'danger', icon: '⚠️' },
      { label: 'Open Invoices', value: summary.finance?.openInvoices || 0, trend: 'Follow up', trendType: 'negative', color: 'danger', icon: '📄' },
      { label: 'Outstanding', value: this.formatCurrency(summary.finance?.outstandingAmount ?? 0), trend: 'INR', trendType: 'neutral', color: 'info', icon: '💰' }
    ];
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

  private formatCurrency(amount: number): string {
    return amount != null ? amount.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

function distributorCount(distributors: any): number {
  if (Array.isArray(distributors)) {
    return distributors.length;
  }

  if (Array.isArray(distributors?.data)) {
    return distributors.data.length;
  }

  return 0;
}

