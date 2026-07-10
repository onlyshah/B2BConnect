import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';

@Component({
  selector: 'app-salesman-samples',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  templateUrl: './salesman-samples.html',
  styleUrls: ['./salesman-samples.css']
})
export class SalesmanSamplesComponent {
  samples = [
    { product: 'New Powder Pack', retailer: 'Krishna Provision', status: 'Approved', qty: '12 units' },
    { product: 'Promotional Trial', retailer: 'Metro Convenience', status: 'Pending', qty: '6 units' }
  ];
}
