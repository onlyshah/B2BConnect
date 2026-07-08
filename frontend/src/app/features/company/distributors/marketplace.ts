import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributorService } from '../../../services/distributor.service';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-distributor-marketplace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.css']
})
export class DistributorMarketplaceComponent implements OnInit, OnDestroy {
  distributors: any[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private distributorService: DistributorService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
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
      next: (data: any[]) => { this.distributors = data || []; this.loading = false; try { this.cd.detectChanges(); } catch(e) {} },
      error: (err) => { console.error('Failed to load distributors', err); this.loading = false; try { this.cd.detectChanges(); } catch(e) {} }
    });
  }

  approve(id: string) {
    this.distributorService.approve(id).subscribe({ next: () => this.load(), error: (e) => console.error(e) });
  }

  reject(id: string) {
    const reason = prompt('Rejection reason (optional)') || '';
    this.distributorService.reject(id, reason).subscribe({ next: () => this.load(), error: (e) => console.error(e) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
