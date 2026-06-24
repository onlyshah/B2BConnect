import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-payments.html',
  styleUrls: ['./retailer-payments.css']
})
export class RetailerPaymentsComponent {
  payments = [
    { title: 'Outstanding Amount', value: '₹12,400' },
    { title: 'Upcoming Due', value: '₹3,200' },
    { title: 'Credit Balance', value: '₹8,000' }
  ];
}
