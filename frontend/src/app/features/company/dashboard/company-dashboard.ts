import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { DashboardSummary } from '../../../models';
import { MvpWorkflowService } from '../../../services/mvp-workflow.service';
import { AuthService } from '../../../services/auth.service';
import { RetailerService } from '../../../services/retailer.service';
import { DistributorService } from '../../../services/distributor.service';
import { OrderService } from '../../../services/order.service';
import { InventoryService } from '../../../services/inventory.service';
import { MetricCardComponent, MetricData } from '../../../shared/components/metric-card';

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
  imports: [CommonModule, RouterModule, MetricCardComponent],
  templateUrl: './company-dashboard.html',
  styleUrls: ['./company-dashboard.css']
})
export class CompanyDashboardComponent implements OnInit, OnDestroy {
  summary: DashboardSummary | null = null;
  metrics: MetricData[] = [];
  pendingRetailers: any[] = [];
  lowStockItems: any[] = [];
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private workflowService: MvpWorkflowService,
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
      summary: this.workflowService.getDashboardSummary(filters).pipe(
        catchError((err) => {
          console.error('Company dashboard summary failed', err);
          return of(emptySummary);
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
      inventory: this.inventoryService.getInventory(filters).pipe(
        catchError((err) => {
          console.error('Company inventory load failed', err);
          return of([]);
        })
      )
    })
      .pipe(takeUntil(this.destroy$), finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ summary, retailers, distributors, orders, inventory }) => {
          this.summary = this.normalizeSummary(summary);
          const retailerList = this.toArray(retailers);
          const orderList = this.toArray(orders);
          const inventoryList = this.toArray(inventory);

          this.pendingRetailers = retailerList
            .filter((item: any) => ['pending', 'requested', 'submitted', 'review', 'in_review', 'under_review'].includes((item.status || '').toLowerCase()))
            .slice(0, 5);

          this.lowStockItems = inventoryList
            .filter((item: any) => (item.stockOnHand ?? item.stock ?? item.quantity ?? 0) <= (item.reorderLevel ?? item.minStock ?? 0))
            .slice(0, 5);

          this.metrics = [
            { label: 'Products', value: this.summary.products || 0, color: 'primary', icon: '📦' },
            { label: 'Distributors', value: (distributors?.length ?? this.summary.distributors) || 0, color: 'info', icon: '🚚' },
            { label: 'Active Retailers', value: this.summary.retailers?.active || 0, color: 'success', icon: '🏪' },
            { label: 'Pending Approval', value: this.summary.retailers?.pendingApproval || 0, color: 'warning', icon: '⏳' },
            { label: 'Pending Orders', value: this.summary.orders?.pending || 0, color: 'warning', icon: '🛒' },
            { label: 'Low Stock Items', value: this.lowStockItems.length, color: 'danger', icon: '⚠️' }
          ];
          this.error = null;
        },
        error: (err) => {
          console.error('Company dashboard load failed', err);
          this.summary = emptySummary;
          this.metrics = [];
          this.pendingRetailers = [];
          this.lowStockItems = [];
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

