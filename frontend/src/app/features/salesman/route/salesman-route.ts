import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-route',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-route.html',
  styleUrls: ['./salesman-route.css']
})
export class SalesmanRouteComponent {
  routeStops = [
    { retailer: 'Krishna Provision', time: '09:00', priority: 'High' },
    { retailer: 'Metro Convenience', time: '11:00', priority: 'Medium' },
    { retailer: 'Jay Ambe Super', time: '14:00', priority: 'High' }
  ];
}
