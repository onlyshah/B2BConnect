import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-samples',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-samples.html',
  styleUrls: ['./salesman-samples.css']
})
export class SalesmanSamplesComponent {
  samples = [
    { product: 'New Powder Pack', retailer: 'Krishna Provision', status: 'Approved' },
    { product: 'Promotional Trial', retailer: 'Metro Convenience', status: 'Pending' }
  ];
}
