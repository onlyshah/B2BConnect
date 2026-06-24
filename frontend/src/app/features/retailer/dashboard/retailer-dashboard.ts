import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiCardComponent, UiStatCardComponent, UiButtonComponent } from '../../../shared/ui';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-retailer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent, UiStatCardComponent, UiButtonComponent],
  templateUrl: './retailer-dashboard.html',
  styleUrls: ['./retailer-dashboard.css']
})
export class RetailerDashboardComponent implements OnInit {
  kpis: Array<{ label: string; value: string; color: string }> = [];
  quickActions = [
    { label: 'Place Order', route: '/retailer/products' },
    { label: 'Request Sample', route: '/retailer/samples' },
    { label: 'View Offers', route: '/retailer/offers' },
    { label: 'Contact Distributor', route: '/retailer/support' },
    { label: 'Request Demo', route: '/retailer/demos' }
  ];

  sections = [
    { title: 'Stories', subtitle: 'Watch new launches and offers', route: '/retailer/stories' },
    { title: 'Products', subtitle: 'Browse your catalog', route: '/retailer/products' },
    { title: 'Orders', subtitle: 'Track deliveries and reorder', route: '/retailer/orders' },
    { title: 'Payments', subtitle: 'Track outstanding and dues', route: '/retailer/payments' }
  ];

  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary: any) => {
        const data = summary?.data ?? summary ?? {};
        this.kpis = [
          { label: 'Products Available', value: `${data.products ?? 0}`, color: '#0f766e' },
          { label: 'Pending Orders', value: `${data.orders?.pending ?? 0}`, color: '#f59e0b' },
          { label: 'Delivered Orders', value: `${data.orders?.delivered ?? 0}`, color: '#10b981' },
          { label: 'Outstanding Amount', value: `₹${(data.finance?.outstandingAmount ?? 0).toLocaleString()}`, color: '#ef4444' }
        ];
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load retailer dashboard.';
        this.loading = false;
      }
    });
  }
}
