import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiBadgeComponent } from '../../../shared/ui/components/ui-badge';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { SalesmanService } from '../../../services/salesman.service';
import { VisitService } from '../../../services/visit.service';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-salesman-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, UiBadgeComponent],
  templateUrl: './salesman-dashboard.html',
  styleUrls: ['./salesman-dashboard.css']
})
export class SalesmanDashboardComponent implements OnInit, OnDestroy {
  salesmanName = '';
  status = '';
  attendance = '';
  gps = '';
  currentArea = '';
  visitTarget = 0;
  visited = 0;
  remainingVisits = 0;
  newRetailerTarget = 0;
  newRetailersAdded = 0;
  remainingNewRetailers = 0;
  todayOrders = 0;
  todayCollections = 0;
  checkInTime: string | null = null;
  checkOutTime: string | null = null;
  lastLocationUpdate = '';
  distanceCovered = '';

  summaryCards: any[] = [];

  quickActions = [
    { label: 'Check In', route: '/salesman/visits' },
    { label: 'Create Order', route: '/salesman/orders' },
    { label: 'Add Retailer', route: '/salesman/retailers' },
    { label: 'Request Sample', route: '/salesman/samples' },
    { label: 'Request Demo', route: '/salesman/demos' },
    { label: 'Collect Payment', route: '/salesman/collections' }
  ];

  assignedRetailers: any[] = [];

  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private salesmanService: SalesmanService,
    private visitService: VisitService,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUserSync();
    const salesmanId = user?.salesmanId || (user?._id && user.role === 'salesman' ? user._id : null);
    if (!salesmanId) {
      this.error = 'Salesman profile not linked';
      this.loading = false;
      return;
    }

    this.error = null;
    this.loading = true;

    forkJoin({
      profile: this.salesmanService.getSalesmanDashboard(salesmanId).pipe(
        catchError((err) => {
          console.error('Salesman profile load failed', err);
          this.error = this.error || 'Unable to load salesman profile.';
          return of(null);
        })
      ),
      visits: this.visitService.getTodayVisits(salesmanId).pipe(
        catchError((err) => {
          console.error('Salesman visits load failed', err);
          this.error = this.error || 'Unable to load visit summary.';
          return of([]);
        })
      ),
      summary: this.dashboardService.getSummary().pipe(
        catchError((err) => {
          console.error('Salesman summary load failed', err);
          this.error = this.error || 'Unable to load workspace summary.';
          return of({});
        })
      )
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
      next: ({ profile, visits, summary }) => {
          if (profile) {
            this.populateFromApi(profile);
          }

          const visitList = Array.isArray(visits) ? visits : [];
          this.visited = visitList.filter((v: any) => v.status === 'completed').length;
          this.remainingVisits = Math.max(0, this.visitTarget - this.visited);

          const data = summary?.data ?? summary ?? {};
          this.todayOrders = data.orders?.pending ?? 0;
          this.todayCollections = data.finance?.outstandingAmount ?? 0;

          if (!profile) {
            this.error = this.error || 'Salesman dashboard data is incomplete.';
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private populateFromApi(perf: any) {
    if (!perf) return;
    this.salesmanName = perf.name || this.salesmanName;
    this.visited = perf.todaysVisits || 0;
    this.visitTarget = perf.targets?.dailyVisitTarget || 0;
    this.remainingVisits = Math.max(0, this.visitTarget - this.visited);
    this.todayOrders = perf.ordersRevenue || perf.ordersCount || 0;
    this.todayCollections = perf.collectionsTotal || 0;

    this.summaryCards = [
      { label: 'Visit Target', value: `${this.visitTarget}`, hint: 'shops today' },
      { label: 'Visited', value: `${this.visited}`, hint: 'completed' },
      { label: 'Orders', value: `₹${this.todayOrders}`, hint: 'today' },
      { label: 'Collections', value: `₹${this.todayCollections}`, hint: 'today' },
      { label: 'New Retailers', value: `${this.newRetailersAdded}`, hint: 'added' },
      { label: 'Attendance', value: perf.attendanceToday?.status || '—', hint: 'live' }
    ];
  }
}
