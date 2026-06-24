import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-samples',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-samples.html',
  styleUrls: ['./retailer-samples.css']
})
export class RetailerSamplesComponent {
  samples = [
    { name: 'Trial Pack', status: 'Approved' },
    { name: 'New Launch Sample', status: 'Pending' }
  ];
}
