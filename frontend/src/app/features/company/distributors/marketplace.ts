import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';
import { DistributorService } from '../../../services/distributor.service';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ResponseHandlerService } from '../../../services/response-handler.service';

@Component({
  selector: 'app-distributor-marketplace',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.css']
})
export class DistributorMarketplaceComponent implements OnInit, OnDestroy {
  distributors: any[] = [];
  loading = false;
  selectedId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private distributorService: DistributorService,
    private authService: AuthService,
    private responseHandler: ResponseHandlerService
  ) {}

  ngOnInit() {
    // initial load (if auth already available)
    this.load();

    // reload when auth becomes available to ensure token is present
    this.authService.currentUser$
      .pipe(filter(user => !!user), takeUntil(this.destroy$))
      .subscribe(() => {
        this.load();
      });
  }

  load() {
    this.loading = true;
    this.distributorService.list({ page: 1, limit: 50 }).subscribe({
      next: (data: any[]) => { this.distributors = data || []; this.loading = false; },
      error: (err) => { console.error('Failed to load distributors', err); this.loading = false; }
    });
  }

  async requestApprove(id: string) {
    this.selectedId = id;
    const confirmed = await this.responseHandler.confirm({
      title: 'Approve distributor',
      message: 'This action will move the distributor into the approved network.',
      confirmText: 'Approve',
      cancelText: 'Cancel',
      confirmVariant: 'success',
      icon: '✅'
    });

    if (!confirmed || !this.selectedId) {
      this.selectedId = null;
      return;
    }

    this.distributorService.approve(this.selectedId).subscribe({
      next: () => {
        this.responseHandler.showSuccess('Distributor approved successfully.');
        this.selectedId = null;
        this.load();
      },
      error: (err) => {
        this.responseHandler.handleApiError(err);
        this.selectedId = null;
      }
    });
  }

  async requestReject(id: string) {
    this.selectedId = id;
    const confirmed = await this.responseHandler.confirm({
      title: 'Reject distributor',
      message: 'This action will mark the distributor as rejected.',
      confirmText: 'Reject',
      cancelText: 'Cancel',
      confirmVariant: 'danger',
      icon: '⚠️'
    });

    if (!confirmed || !this.selectedId) {
      this.selectedId = null;
      return;
    }

    this.distributorService.reject(this.selectedId, '').subscribe({
      next: () => {
        this.responseHandler.showSuccess('Distributor rejected successfully.');
        this.selectedId = null;
        this.load();
      },
      error: (err) => {
        this.responseHandler.handleApiError(err);
        this.selectedId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
