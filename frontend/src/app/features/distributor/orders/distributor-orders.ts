import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-distributor-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Orders" eyebrow="fulfillment" description="Track distributor orders and support smooth fulfillment for your retailers.">
      <div class="module-shell">
        <ui-card title="Live order activity" subtitle="Recent requests and pending action">
          <div class="module-list">
            <div class="module-row"><span>Pending dispatch</span><strong>12</strong></div>
            <div class="module-row"><span>Delivered today</span><strong>8</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class DistributorOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = (data as any)?.data ?? data ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load orders';
        this.loading = false;
      }
    });
  }
}
