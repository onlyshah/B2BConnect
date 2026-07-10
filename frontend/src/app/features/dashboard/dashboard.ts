import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { DashboardSummary } from '../../models';
import { MvpWorkflowService } from '../../services/mvp-workflow.service';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { DashboardLayoutComponent, DashboardNavGroup, DashboardNavItem } from '../../shared/ui/layouts/dashboard-layout';
import { UiButtonComponent } from '../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../shared/ui/components/ui-card';
import { MetricData } from '../../shared/components/metric-card';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  permission?: string;
}

interface CurrentUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent, UiButtonComponent, UiCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  userRole: string | null = null;

  menuItems: MenuItem[] = [];
  navGroups: DashboardNavGroup[] = [];
  mobileNavItems: DashboardNavItem[] = [];
  summary: DashboardSummary | null = null;
  loadingSummary = true;
  summaryError: string | null = null;

  metrics: MetricData[] = [];
  dashboardCards: Array<{ title: string; value: string | number; subtitle: string; icon?: string }> = [];
  chartBars: Array<{ label: string; value: number; color: string }> = [];
  salesSeries: number[] = [];
  inventorySeries: Array<{ label: string; stock: number; reorderLevel: number }> = [];
  recentOrders: any[] = [];
  topSalesmen: any[] = [];
  lowStockCount = 0;
  overview: any = null;
  trendPoints = '';
  chartMax = 1;
  svgWidth = 360;
  svgHeight = 180;

  title = 'Dashboard';
  subtitle = 'Live company operations and performance';
  eyebrow = 'Operations';

  private destroy$ = new Subject<void>();

  constructor(
    private workflowService: MvpWorkflowService,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const existingUser = this.authService.getCurrentUserSync();
    if (existingUser) {
      this.applyUser(existingUser);
    }

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.applyUser(user);
        } else {
          this.loadingSummary = false;
          this.summaryError = 'Please sign in to view your dashboard.';
          this.menuItems = [];
          this.navGroups = [];
          this.mobileNavItems = [];
        }
      });
  }

  get roleLabel(): string {
    switch (this.userRole) {
      case 'super-admin':
        return 'Platform Administrator';
      case 'company-admin':
        return 'Company Administrator';
      case 'distributor-admin':
        return 'Distributor Administrator';
      case 'salesman':
        return 'Sales Executive';
      case 'retailer':
        return 'Retailer';
      default:
        return 'Operator';
    }
  }

  private applyUser(user: any) {
    const fullName = (user as any).name || `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim();

    this.currentUser = {
      id: (user as any)._id || user.id,
      name: fullName || user.email,
      email: user.email,
      role: user.role
    };
    this.userRole = user.role;
    this.buildMenuItems();
    this.buildNavConfiguration();
    this.loadDashboardData();
  }

  private buildNavConfiguration() {
    this.navGroups = [
      {
        title: 'Workspace',
        items: this.menuItems
      }
    ];

    this.mobileNavItems = this.menuItems.map((item) => ({
      label: item.label,
      route: item.route,
      icon: item.icon
    }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  getMetricColor(metric: MetricData): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
    if (metric.color) return metric.color;

    if (metric.label.toLowerCase().includes('pending') || metric.label.toLowerCase().includes('outstanding')) {
      return 'warning';
    }
    if (metric.label.toLowerCase().includes('low')) {
      return 'danger';
    }
    if (metric.label.toLowerCase().includes('active') || metric.label.toLowerCase().includes('revenue')) {
      return 'success';
    }
    return 'primary';
  }

  private buildMenuItems() {
    const allMenuItems: Record<string, MenuItem[]> = {
      'super-admin': [
        { label: 'Companies', route: 'companies', icon: '🏢', permission: 'view-companies' },
        { label: 'Users', route: 'users', icon: '👥', permission: 'view-users' },
        { label: 'Analytics', route: 'analytics', icon: '📊', permission: 'view-analytics' },
        { label: 'Platform', route: 'platform', icon: '⚙️', permission: 'manage-platform' },
        { label: 'Profile', route: 'profile', icon: '👤', permission: 'view-profile' }
      ],
      'company-admin': [
        { label: 'Dashboard', route: 'dashboard', icon: '📈', permission: 'view-dashboard' },
        { label: 'Distributors', route: 'distributors', icon: '🚚', permission: 'view-distributors' },
        { label: 'Products', route: 'products', icon: '📦', permission: 'manage-products' },
        { label: 'Campaigns', route: 'campaigns', icon: '📢', permission: 'manage-campaigns' },
        { label: 'Stories', route: 'stories', icon: '📝', permission: 'manage-stories' },
        { label: 'Schemes', route: 'schemes', icon: '🎁', permission: 'manage-schemes' },
        { label: 'Analytics', route: 'analytics', icon: '📊', permission: 'view-analytics' },
        { label: 'Profile', route: 'profile', icon: '👤', permission: 'view-profile' }
      ],
      'distributor-admin': [
        { label: 'Dashboard', route: 'dashboard', icon: '📈', permission: 'view-dashboard' },
        { label: 'Orders', route: 'orders', icon: '📦', permission: 'view-orders' },
        { label: 'Inventory', route: 'inventory', icon: '📚', permission: 'view-inventory' },
        { label: 'Retailers', route: 'retailers', icon: '🏪', permission: 'view-retailers' },
        { label: 'Collections', route: 'collections', icon: '💰', permission: 'view-collections' },
        { label: 'Profile', route: 'profile', icon: '👤', permission: 'view-profile' }
      ],
      salesman: [
        { label: 'Dashboard', route: 'dashboard', icon: '📈', permission: 'view-dashboard' },
        { label: 'Visits', route: 'visits', icon: '📍', permission: 'view-visits' },
        { label: 'Retailers', route: 'retailers', icon: '🏪', permission: 'view-retailers' },
        { label: 'Orders', route: 'orders', icon: '📦', permission: 'view-orders' },
        { label: 'Follow-ups', route: 'followups', icon: '🔔', permission: 'view-followups' },
        { label: 'Profile', route: 'profile', icon: '👤', permission: 'view-profile' }
      ],
      retailer: [
        { label: 'Dashboard', route: 'dashboard', icon: '📈', permission: 'view-dashboard' },
        { label: 'Products', route: 'products', icon: '📦', permission: 'view-products' },
        { label: 'Orders', route: 'orders', icon: '🛒', permission: 'view-orders' },
        { label: 'Offers', route: 'offers', icon: '🎁', permission: 'view-offers' },
        { label: 'Payments', route: 'payments', icon: '💳', permission: 'view-payments' },
        { label: 'Profile', route: 'profile', icon: '👤', permission: 'view-profile' }
      ]
    };

    const normalizedRole = (this.userRole || 'retailer').replace(/_/g, '-');
    this.menuItems = allMenuItems[normalizedRole] || allMenuItems['retailer'];
  }

  private loadDashboardData() {
    this.loadingSummary = true;
    this.summaryError = null;

    forkJoin({
      summary: this.workflowService.getDashboardSummary().pipe(
        catchError((err) => {
          console.error('Dashboard summary failed', err);
          this.summaryError = 'Summary unavailable';
          return of(null);
        })
      ),
      overview: this.dashboardService.getDashboardOverview().pipe(
        catchError((err) => {
          console.error('Dashboard overview failed', err);
          return of(null);
        })
      ),
      sales: this.dashboardService.getSalesPerformance().pipe(
        catchError((err) => {
          console.error('Sales performance failed', err);
          return of(null);
        })
      ),
      inventory: this.dashboardService.getInventoryPerformance().pipe(
        catchError((err) => {
          console.error('Inventory performance failed', err);
          return of(null);
        })
      )
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingSummary = false;
        })
      )
      .subscribe({
        next: ({ summary, overview, sales, inventory }) => {
          this.summary = summary ?? this.summary;
          this.overview = overview ?? this.overview;
          this.recentOrders = (this.overview?.recentOrders || []).slice(0, 6);
          this.topSalesmen = this.overview?.topSalesmen || [];
          this.lowStockCount = this.overview?.lowStockItems ?? this.summary?.inventory?.lowStock ?? 0;

          this.buildMetrics();
          this.buildDashboardCards();
          this.buildCharts(sales, inventory);

          if (!this.summaryError) {
            this.summaryError = null;
          }
        }
      });
  }

  private buildMetrics() {
    if (!this.summary) return;

    const metricsMap: Record<string, MetricData[]> = {
      'super-admin': [
        { label: 'Active Companies', value: this.summary.distributors || 0, color: 'primary', icon: '🏢', trend: 'up', trendPercent: 5 },
        { label: 'Total Retailers', value: this.summary.retailers?.active || 0, color: 'info', icon: '🏪' },
        { label: 'Orders Delivered', value: this.summary.orders?.delivered || 0, color: 'success', icon: '✅' },
        { label: 'Open Invoices', value: this.summary.finance?.openInvoices || 0, color: 'warning', icon: '💳' }
      ],
      'company-admin': [
        { label: 'Active Distributors', value: this.summary.distributors || 0, color: 'primary', icon: '🚚', trend: 'up', trendPercent: 4 },
        { label: 'Active Retailers', value: this.summary.retailers?.active || 0, color: 'info', icon: '🏪' },
        { label: 'Products Live', value: this.summary.products || 0, color: 'success', icon: '📦' },
        { label: 'Active Campaigns', value: this.summary.campaigns?.active || 0, color: 'warning', icon: '📢' },
        { label: 'Active Schemes', value: this.summary.schemes?.active || 0, color: 'info', icon: '🎁' }
      ],
      'distributor-admin': [
        { label: 'Pending Orders', value: this.summary.orders?.pending || 0, color: 'warning', icon: '📦', trend: 'down', trendPercent: 5 },
        { label: 'Active Retailers', value: this.summary.retailers?.active || 0, color: 'primary', icon: '🏪' },
        { label: 'Low Stock Items', value: this.summary.inventory?.lowStock || 0, color: 'danger', icon: '📉' },
        { label: 'Outstanding Amount', value: `₹${this.summary.finance?.outstandingAmount || 0}`, color: 'info', icon: '💰' }
      ],
      salesman: [
        { label: "Today's Visits", value: this.overview?.metrics?.ordersToday ?? 0, color: 'primary', icon: '📍', trend: 'neutral' },
        { label: 'Retailers Contacted', value: this.summary.retailers?.active || 0, color: 'info', icon: '🏪' },
        { label: 'Pending Samples', value: this.summary.workflows?.pendingSamples || 0, color: 'warning', icon: '🔔' },
        { label: 'Delivered Orders', value: this.summary.orders?.delivered || 0, color: 'success', icon: '📦', trend: 'up', trendPercent: 15 }
      ],
      retailer: [
        { label: 'Total Orders', value: this.summary.orders?.pending || 0, color: 'primary', icon: '🛒' },
        { label: 'Pending Approval', value: this.summary.retailers?.pendingApproval || 0, color: 'warning', icon: '⏳' },
        { label: 'Available Products', value: this.summary.products || 0, color: 'success', icon: '📦' },
        { label: 'Account Balance', value: '$0', color: 'info', icon: '💳' }
      ]
    };

    const role = (this.userRole || 'retailer').replace(/_/g, '-');
    this.metrics = metricsMap[role] || metricsMap['retailer'];
  }

  private buildDashboardCards(): void {
    const summary = this.summary;
    this.dashboardCards = [
      {
        title: 'Products',
        value: summary?.products ?? 0,
        subtitle: 'Live catalog',
        icon: '📦'
      },
      {
        title: 'Distributors',
        value: summary?.distributors ?? 0,
        subtitle: 'Active partners',
        icon: '🚚'
      },
      {
        title: 'Pending Orders',
        value: summary?.orders?.pending ?? 0,
        subtitle: 'Awaiting fulfillment',
        icon: '⏳'
      },
      {
        title: 'Low Stock',
        value: this.lowStockCount,
        subtitle: 'Needs attention',
        icon: '📉'
      }
    ];
  }

  private buildCharts(sales: any, inventory: any): void {
    const summary = this.summary;
    const baseBars = summary
      ? [
          { label: 'Products', value: summary.products || 0, color: '#2563eb' },
          { label: 'Distributors', value: summary.distributors || 0, color: '#0f766e' },
          { label: 'Retailers', value: summary.retailers?.active || 0, color: '#7c3aed' },
          { label: 'Pending Orders', value: summary.orders?.pending || 0, color: '#ea580c' },
          { label: 'Low Stock', value: summary.inventory?.lowStock || 0, color: '#dc2626' },
          { label: 'Open Invoices', value: summary.finance?.openInvoices || 0, color: '#0891b2' }
        ]
      : [];

    this.chartBars = baseBars;
    this.chartMax = Math.max(1, ...baseBars.map((bar) => bar.value));

    const salesOrders = Array.isArray(sales?.orders) ? sales.orders : [];
    const salesValues = salesOrders
      .slice(0, 8)
      .map((order: any) => Number(order.totalAmount ?? order.total ?? 0))
      .filter((value: number) => Number.isFinite(value) && value >= 0);
    this.salesSeries = salesValues.length ? salesValues : baseBars.map((bar) => bar.value);
    this.trendPoints = this.buildPolylinePoints(this.salesSeries);

    const inventoryItems = Array.isArray(inventory?.topItems) ? inventory.topItems : [];
    this.inventorySeries = inventoryItems.slice(0, 6).map((item: any, index: number) => ({
      label: item.productId?.name || item.name || `Item ${index + 1}`,
      stock: Number(item.stockOnHand ?? item.stock ?? item.quantity ?? 0),
      reorderLevel: Number(item.reorderLevel ?? item.minStock ?? 0)
    }));

    if (!this.inventorySeries.length && summary) {
      this.inventorySeries = [
        { label: 'Low stock', stock: summary.inventory?.lowStock || 0, reorderLevel: 0 }
      ];
    }
  }

  private buildPolylinePoints(values: number[]): string {
    if (!values.length) {
      return '';
    }

    const max = Math.max(...values, 1);
    const step = values.length === 1 ? this.svgWidth / 2 : this.svgWidth / (values.length - 1);

    return values
      .map((value, index) => {
        const x = Math.round(step * index);
        const y = Math.round(this.svgHeight - (value / max) * (this.svgHeight - 24) - 12);
        return `${x},${y}`;
      })
      .join(' ');
  }

  getBarWidth(value: number): number {
    if (!value) {
      return 4;
    }

    return Math.max(4, (value / this.chartMax) * 100);
  }
}
