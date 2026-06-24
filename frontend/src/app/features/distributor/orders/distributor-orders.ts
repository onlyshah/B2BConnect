import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-distributor-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './distributor-orders.html',
  styleUrls: ['./distributor-orders.css']
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
