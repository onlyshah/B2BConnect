import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardSummary } from '../../models';
import { MvpWorkflowService } from '../../services/mvp-workflow.service';
import { AuthService } from '../../services/auth.service';
import { MetricCardComponent, MetricData } from '../../shared/components/metric-card';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

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
  imports: [CommonModule, RouterModule, MetricCardComponent, HasPermissionDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  userRole: string | null = null;

  menuItems: MenuItem[] = [];
  summary: DashboardSummary | null = null;
  loadingSummary = true;
  summaryError: string | null = null;

  metrics: MetricData[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private workflowService: MvpWorkflowService,
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
        }
      });
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
    this.loadDashboardData();
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
    this.workflowService.getDashboardSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary: DashboardSummary) => {
          this.summary = summary;
          this.buildMetrics();
          this.loadingSummary = false;
        },
        error: () => {
          this.summaryError = 'Summary unavailable';
          this.loadingSummary = false;
        }
      });
  }

  private buildMetrics() {
    if (!this.summary) return;

    const metricsMap: Record<string, MetricData[]> = {
      'super-admin': [
        { label: 'Active Companies', value: this.summary.distributors || 0, color: 'primary', icon: '🏢', trend: 'up', trendPercent: 5 },
        { label: 'Total Users', value: 0, color: 'info', icon: '👥', trend: 'up', trendPercent: 3 },
        { label: 'Platform Revenue', value: '$0', color: 'success', icon: '💰', trend: 'up', trendPercent: 8 },
        { label: 'Active Retailers', value: this.summary.retailers?.active || 0, color: 'primary', icon: '🏪' }
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
        { label: "Today's Visits", value: 0, color: 'primary', icon: '📍', trend: 'neutral' },
        { label: 'Retailers Contacted', value: 0, color: 'info', icon: '🏪' },
        { label: 'Pending Follow-ups', value: 0, color: 'warning', icon: '🔔' },
        { label: 'Orders Created', value: this.summary.orders?.pending || 0, color: 'success', icon: '📦', trend: 'up', trendPercent: 15 }
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
}
