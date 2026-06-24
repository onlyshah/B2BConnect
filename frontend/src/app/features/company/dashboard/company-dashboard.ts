import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardSummary } from '../../../models';
import { MvpWorkflowService } from '../../../services/mvp-workflow.service';
import { AuthService } from '../../../services/auth.service';

const emptySummary: DashboardSummary = {
  products: 0,
  distributors: 0,
  retailers: { active: 0, pendingApproval: 0 },
  orders: { pending: 0, delivered: 0 },
  finance: { openInvoices: 0, outstandingAmount: 0 },
  inventory: { lowStock: 0 },
  workflows: { pendingSamples: 0, openReturns: 0 },
  discovery: { publishedStories: 0, averageRating: 0 },
  campaigns: { active: 0 },
  schemes: { active: 0 },
} as DashboardSummary;

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-dashboard.html',
  styleUrls: ['./company-dashboard.css']
})
export class CompanyDashboardComponent implements OnInit, OnDestroy {
  summary: DashboardSummary | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private workflowService: MvpWorkflowService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const companyId = this.authService.getCurrentUserSync()?.companyId;
    this.workflowService.getDashboardSummary(companyId ? { companyId } : {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary) => {
          this.summary = this.normalizeSummary(summary);
          this.error = null;
          this.loading = false;
        },
        error: (err) => {
          console.error('Company dashboard load failed', err);
          this.summary = emptySummary;
          this.error = null;
          this.loading = false;
        }
      });
  }

  private normalizeSummary(summary: any): DashboardSummary {
    if (!summary || typeof summary !== 'object') {
      return emptySummary;
    }

    return {
      ...emptySummary,
      ...summary,
      retailers: {
        active: summary?.retailers?.active ?? summary?.retailers?.activeCount ?? 0,
        pendingApproval: summary?.retailers?.pendingApproval ?? summary?.retailers?.pending ?? 0,
      },
      orders: {
        pending: summary?.orders?.pending ?? 0,
        delivered: summary?.orders?.delivered ?? 0,
      },
      finance: {
        openInvoices: summary?.finance?.openInvoices ?? 0,
        outstandingAmount: summary?.finance?.outstandingAmount ?? 0,
      },
      inventory: {
        lowStock: summary?.inventory?.lowStock ?? 0,
      },
      workflows: {
        pendingSamples: summary?.workflows?.pendingSamples ?? 0,
        openReturns: summary?.workflows?.openReturns ?? 0,
      },
      discovery: {
        publishedStories: summary?.discovery?.publishedStories ?? 0,
        averageRating: summary?.discovery?.averageRating ?? 0,
      },
      campaigns: {
        active: summary?.campaigns?.active ?? 0,
      },
      schemes: {
        active: summary?.schemes?.active ?? 0,
      },
    } as DashboardSummary;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

