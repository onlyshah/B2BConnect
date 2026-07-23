import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiListToolbarComponent } from '../../../shared/ui/components/ui-list-toolbar';
import { UiKpiCardComponent } from '../../../shared/ui/components/ui-kpi-card';
import { UiDataTableComponent, UiDataTableColumn } from '../../../shared/ui/components/ui-data-table';
import { UiFormFieldComponent } from '../../../shared/ui/components/ui-form-field';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiPageShellComponent, UiEmptyStateComponent, UiListToolbarComponent, UiKpiCardComponent, UiDataTableComponent, UiFormFieldComponent],
  template: `
    <ui-page-shell title="Orders" eyebrow="operations" description="Monitor the newest orders and their fulfillment state.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Export</ui-button>
        <ui-button>+ New order</ui-button>
      </ng-container>

      <ui-list-toolbar title="Orders queue" subtitle="Review order progress and execution status.">
        <ng-container slot="actions">
          <ui-button variant="secondary">Filter</ui-button>
          <ui-button>+ Create</ui-button>
        </ng-container>
      </ui-list-toolbar>

      <div class="page-grid" *ngIf="!loading && !error">
        <ui-kpi-card label="Open orders" [value]="orders.length.toString()" hint="Current queue size"></ui-kpi-card>
        <ui-kpi-card label="Statuses tracked" [value]="(orderCounts | keyvalue).length.toString()" hint="Distinct progress states"></ui-kpi-card>
      </div>

      <ui-form-field label="Search orders" hint="Use shared form controls for list-driven workflows">
        <input type="text" placeholder="Search orders" />
      </ui-form-field>

      <ui-data-table
        title="Recent orders"
        subtitle="A reusable table for operational lists"
        [columns]="overviewColumns"
        [rows]="orders"
        [loading]="loading"
        emptyTitle="No orders yet"
        emptyDescription="Create your first order to start tracking fulfillment."
      ></ui-data-table>

      <ui-empty-state *ngIf="loading" title="Loading orders" description="Gathering your recent order activity."></ui-empty-state>
      <ui-empty-state *ngIf="error" title="We hit a snag" [description]="error" tone="error"></ui-empty-state>
    </ui-page-shell>
  `,
  styles: []
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  orderCounts: Record<string, number> = {};
  overviewColumns: UiDataTableColumn[] = [
    { key: '_id', label: 'Order ID' },
    { key: 'orderType', label: 'Type' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'total', label: 'Total', type: 'currency', align: 'right' },
    { key: 'createdAt', label: 'Created', type: 'date' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.orderCounts = this.orders.reduce((counts, order) => {
          const status = order.status || 'unknown';
          counts[status] = (counts[status] || 0) + 1;
          return counts;
        }, {} as Record<string, number>);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      pending: '#f39c12',
      confirmed: '#3498db',
      shipped: '#9b59b6',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  }
}
