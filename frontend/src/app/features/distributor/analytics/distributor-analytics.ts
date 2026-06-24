import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-distributor-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './distributor-analytics.html',
  styleUrls: ['./distributor-analytics.css']
})
export class DistributorAnalyticsComponent implements OnInit {
  analytics: any = null;
  loading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.analytics = data?.data ?? data ?? {};
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load analytics';
        this.loading = false;
      }
    });
  }
}
