import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent, UiPageShellComponent],
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
