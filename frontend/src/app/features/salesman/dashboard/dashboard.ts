import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SalesmanService } from '../../../services/salesman.service';
import { VisitService } from '../../../services/visit.service';
import { DashboardService } from '../../../services/dashboard.service';
import { SalesmanCheckinComponent } from './salesman-checkin/salesman-checkin';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-salesman-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SalesmanCheckinComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class SalesmanDashboardComponent implements OnInit {
  salesmanData: any = null;
  todayStats = {
    targetVisits: 0,
    completedVisits: 0,
    pendingVisits: 0,
    ordersGenerated: 0,
    samplesRequested: 0,
    retailersAdded: 0,
    revenueGenerated: 0,
    followUpsDue: 0
  };
  loading = true;
  error: string | null = null;

  constructor(
    private salesmanService: SalesmanService,
    private visitService: VisitService,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    const user = this.authService.getCurrentUserSync();
    const salesmanId = user?.salesmanId;

    if (!salesmanId) {
      this.error = 'Salesman profile not available.';
      this.loading = false;
      return;
    }

    this.salesmanService.getSalesman(salesmanId).subscribe({
      next: (data) => {
        this.salesmanData = data;
        this.todayStats.targetVisits = data?.dailyVisitTarget ?? 0;
        this.loadTodayStats();
      },
      error: () => {
        this.error = 'Unable to load salesman profile.';
        this.loading = false;
      }
    });
  }

  loadTodayStats() {
    const user = this.authService.getCurrentUserSync();
    const salesmanId = user?.salesmanId;

    this.visitService.getTodayVisits(salesmanId).subscribe({
      next: (visits) => {
        this.todayStats.completedVisits = visits.filter((v: any) => v.status === 'completed').length;
        this.todayStats.pendingVisits = visits.filter((v: any) => v.status === 'pending').length;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load visit summary.';
        this.loading = false;
      }
    });

    this.dashboardService.getSummary().subscribe({
      next: (summary: any) => {
        const data = summary?.data ?? summary ?? {};
        this.todayStats.ordersGenerated = data.orders?.pending ?? 0;
        this.todayStats.revenueGenerated = data.finance?.outstandingAmount ?? 0;
      },
      error: () => {
        this.todayStats.ordersGenerated = 0;
        this.todayStats.revenueGenerated = 0;
      }
    });
  }
}
