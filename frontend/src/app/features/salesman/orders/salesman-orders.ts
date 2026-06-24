import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-orders.html',
  styleUrls: ['./salesman-orders.css']
})
export class SalesmanOrdersComponent {
  orders = [
    { id: 'ORD-2001', retailer: 'Krishna Provision', amount: '₹4,200', status: 'Submitted' },
    { id: 'ORD-2002', retailer: 'Metro Convenience', amount: '₹1,100', status: 'Draft' }
  ];
}
