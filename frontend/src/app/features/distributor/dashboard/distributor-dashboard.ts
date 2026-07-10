import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DashboardService } from '../../../services/dashboard.service';
import { RetailerService } from '../../../services/retailer.service';
import { OrderService } from '../../../services/order.service';
import { InventoryService } from '../../../services/inventory.service';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiBadgeComponent } from '../../../shared/ui/components/ui-badge';
import { MetricCardComponent, MetricData } from '../../../shared/components/metric-card';

@Component({
  selector: 'app-distributor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent, UiButtonComponent, UiCardComponent, UiBadgeComponent],
  templateUrl: './distributor-dashboard.html',
  styleUrls: ['./distributor-dashboard.css']
})
export class DistributorDashboardComponent implements OnInit {
  metrics: MetricData[] = [];
  recentOrders: any[] = [];
  recentRetailers: any[] = [];
  lowStockItems: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private retailerService: RetailerService,
    private orderService: OrderService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = null;

    const toArray = (value: any): any[] => {
      if (Array.isArray(value)) {
        return value;
      }

      if (Array.isArray(value?.data)) {
        return value.data;
      }

      return [];
    };

    const toObject = (value: any): Record<string, any> => {
      if (value && typeof value === 'object' && Array.isArray(value.data) === false) {
        if (value.data && typeof value.data === 'object' && !Array.isArray(value.data)) {
          return value.data;
        }

        return value;
      }

      return {};
    };

    forkJoin({
      summary: this.dashboardService.getSummary().pipe(
        catchError((err) => {
          console.error('Distributor summary load failed', err);
          return of({});
        })
      ),
      retailers: this.retailerService.getRetailers().pipe(
        catchError((err) => {
          console.error('Distributor retailers load failed', err);
          return of([]);
        })
      ),
      orders: this.orderService.getOrders().pipe(
        catchError((err) => {
          console.error('Distributor orders load failed', err);
          return of([]);
        })
      ),
      inventory: this.inventoryService.getInventory().pipe(
        catchError((err) => {
          console.error('Distributor inventory load failed', err);
          return of([]);
        })
      )
    }).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: ({ summary, retailers, orders, inventory }) => {
        const normalizedSummary = toObject(summary);
        const retailerList = toArray(retailers);
        const orderList = toArray(orders);
        const inventoryList = toArray(inventory);

        const activeRetailers = retailerList.filter((item: any) => ['approved', 'active', 'verified'].includes((item.status || '').toLowerCase())).length;
        const pendingOrders = orderList.filter((item: any) => ['pending', 'requested', 'processing'].includes((item.status || '').toLowerCase())).length;
        const inventoryValue = inventoryList.reduce((acc: number, item: any) => {
          const stock = item.stockOnHand ?? item.stock ?? item.quantity ?? 0;
          const price = item.price ?? item.unitPrice ?? item.product?.price ?? item.productId?.mrp ?? 0;
          return acc + (stock * price);
        }, 0);

        this.metrics = [
          { label: 'Total Retailers', value: retailerList.length, color: 'primary', icon: '🏪', trend: 'up', trendPercent: 8 },
          { label: 'Active Retailers', value: activeRetailers, color: 'success', icon: '✅' },
          { label: 'Pending Orders', value: pendingOrders, color: 'warning', icon: '⏳' },
          { label: 'Inventory Value', value: `₹${inventoryValue.toLocaleString()}`, color: 'info', icon: '📦' }
        ];
        this.recentOrders = orderList.slice(0, 5).map((order: any) => ({
          ...order,
          retailerName: order.retailerName ?? order.retailer?.name ?? 'Retailer',
          orderNumber: order.orderNumber ?? order._id?.slice(-6).toUpperCase() ?? 'Order'
        }));
        this.recentRetailers = retailerList.slice(0, 5).map((retailer: any) => ({
          ...retailer,
          name: retailer.name || retailer.retailerName || 'Retailer'
        }));
        this.lowStockItems = inventoryList
          .filter((item: any) => (item.stockOnHand ?? item.stock ?? item.quantity ?? 0) <= (item.reorderLevel ?? item.minStock ?? 0))
          .slice(0, 5);
        this.error = null;
      },
      error: (err) => {
        console.error('Distributor dashboard load failed', err);
        this.error = 'Could not load distributor dashboard';
      }
    });
  }
}
