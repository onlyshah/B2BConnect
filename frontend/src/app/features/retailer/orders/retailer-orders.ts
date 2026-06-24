import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-orders.html',
  styleUrls: ['./retailer-orders.css']
})
export class RetailerOrdersComponent {
  orders = [
    { id: 'ORD-1001', status: 'Delivered', amount: '₹2,400' },
    { id: 'ORD-1002', status: 'Pending', amount: '₹1,180' },
    { id: 'ORD-1003', status: 'Packed', amount: '₹860' }
  ];
}
