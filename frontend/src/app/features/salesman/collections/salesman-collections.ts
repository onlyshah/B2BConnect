import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-collections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-collections.html',
  styleUrls: ['./salesman-collections.css']
})
export class SalesmanCollectionsComponent {
  collections = [
    { retailer: 'Krishna Provision', amount: '₹2,000', mode: 'UPI' },
    { retailer: 'Jay Ambe Super', amount: '₹1,500', mode: 'Cash' }
  ];
}
