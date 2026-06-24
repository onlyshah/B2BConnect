import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-demos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-demos.html',
  styleUrls: ['./retailer-demos.css']
})
export class RetailerDemosComponent {
  requests = [
    { title: 'Product Demo', status: 'Scheduled' },
    { title: 'Store Visit', status: 'Requested' }
  ];
}
