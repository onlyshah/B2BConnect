import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-salesman-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './salesman-dashboard.html',
  styleUrls: ['./salesman-dashboard.css']
})
export class SalesmanDashboardComponent {
  kpis = [
    { label: 'Today Visits', value: '12' },
    { label: 'Completed', value: '8' },
    { label: 'Pending', value: '4' },
    { label: 'Orders Booked', value: '24' },
    { label: 'Revenue', value: '₹18,400' },
    { label: 'Target %', value: '82%' }
  ];

  quickActions = [
    { label: 'Check In', route: '/salesman/route' },
    { label: 'Create Order', route: '/salesman/orders' },
    { label: 'Add Retailer', route: '/salesman/retailers' },
    { label: 'Request Sample', route: '/salesman/samples' },
    { label: 'Request Demo', route: '/salesman/demos' },
    { label: 'Submit Visit', route: '/salesman/visits' }
  ];
}
