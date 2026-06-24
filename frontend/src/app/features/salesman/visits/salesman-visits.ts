import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-visits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-visits.html',
  styleUrls: ['./salesman-visits.css']
})
export class SalesmanVisitsComponent {
  visits = [
    { retailer: 'Krishna Provision', status: 'Completed', note: 'Product demo done' },
    { retailer: 'Metro Convenience', status: 'Pending', note: 'Follow-up scheduled' }
  ];
}
