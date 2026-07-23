import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Orders" eyebrow="sales" description="See your recent sales orders and their current progress.">
      <div class="module-shell">
        <ui-card title="Order summary" subtitle="Current month">
          <div class="module-list">
            <div class="module-row"><span>Submitted</span><strong>11</strong></div>
            <div class="module-row"><span>Approved</span><strong>8</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class SalesmanOrdersComponent implements OnInit {
  orders = [
    { id: 'ORD-2001', retailer: 'Jay Ambe Provision Store', amount: '₹4,200', status: 'Submitted', delivery: 'Pending' },
    { id: 'ORD-2002', retailer: 'Shiv Shakti Kirana', amount: '₹1,100', status: 'Draft', delivery: 'Draft' },
    { id: 'ORD-2003', retailer: 'Krishna Mart', amount: '₹6,300', status: 'Delivered', delivery: 'Delivered' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = Array.isArray(orders) && orders.length ? orders.slice(0, 5).map((order: any) => this.toOrderView(order)) : this.orders;
      },
      error: () => {
        this.orders = this.orders;
      }
    });
  }

  private toOrderView(order: any) {
    return {
      id: order?.orderNumber || order?._id?.slice(-6).toUpperCase() || 'ORD-0001',
      retailer: order?.retailerId?.name || order?.retailerName || 'Assigned retailer',
      amount: this.formatCurrency(order?.totalAmount || order?.amount || 0),
      status: this.capitalize(order?.status || 'draft'),
      delivery: order?.deliveryStatus || (order?.status === 'delivered' ? 'Delivered' : 'Pending')
    };
  }

  private formatCurrency(value: number) {
    return `₹${value.toLocaleString('en-IN')}`;
  }

  private capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
