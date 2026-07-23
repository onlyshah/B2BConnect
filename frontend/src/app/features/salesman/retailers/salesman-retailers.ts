import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SalesmanService } from '../../../services/salesman.service';
import { RetailerService } from '../../../services/retailer.service';
import { AuthService } from '../../../services/auth.service';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiBadgeComponent } from '../../../shared/ui/components/ui-badge';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-retailers',
  standalone: true,
  imports: [CommonModule, RouterModule, UiButtonComponent, UiCardComponent, UiBadgeComponent, UiEmptyStateComponent, UiPageShellComponent],
  templateUrl: './salesman-retailers.html',
  styleUrls: ['./salesman-retailers.css']
})
export class SalesmanRetailersComponent implements OnInit {
  retailers: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private salesmanService: SalesmanService,
    private retailerService: RetailerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUserSync();
    const salesmanId = user?.salesmanId || user?._id;

    if (!salesmanId) {
      this.error = 'Salesman profile not linked.';
      this.retailers = this.fallbackRetailers();
      this.loading = false;
      return;
    }

    forkJoin({
      salesman: this.salesmanService.getSalesman(salesmanId).pipe(catchError((err) => {
        console.error('Salesman retailer profile load failed', err);
        return of(null);
      })),
      retailers: this.retailerService.getRetailers({ limit: 50 }).pipe(catchError((err) => {
        console.error('Salesman retailer list load failed', err);
        return of([]);
      }))
    }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ({ salesman, retailers }) => {
        const assignedRetailers = Array.isArray(salesman?.assignedRetailers) ? salesman.assignedRetailers : [];
        const retailerList = Array.isArray(retailers) ? retailers : [];

        const filtered = assignedRetailers.length
          ? retailerList.filter((retailer: any) => {
              const id = retailer?._id?.toString();
              return assignedRetailers.some((assigned: any) => assigned?.toString?.() === id || assigned?._id?.toString?.() === id);
            })
          : retailerList;

        this.retailers = filtered.length ? filtered.map((retailer: any) => this.toRetailerView(retailer)) : this.fallbackRetailers();

        if (!filtered.length) {
          this.error = 'No retailers were assigned yet.';
        }
      },
      error: () => {
        this.error = 'Unable to load retailer list right now.';
        this.retailers = this.fallbackRetailers();
      }
    });
  }

  private toRetailerView(retailer: any) {
    return {
      name: retailer?.name || retailer?.retailerName || retailer?.storeName || 'Assigned retailer',
      address: retailer?.city || retailer?.address || retailer?.area || retailer?.location?.city || 'Assigned area',
      outstanding: this.formatCurrency(retailer?.outstandingBalance || 0),
      lastVisit: retailer?.lastVisit || 'New prospect',
      status: retailer?.status || 'Active'
    };
  }

  private fallbackRetailers() {
    return [
      { name: 'Jay Ambe Provision Store', address: 'Makarpura', outstanding: '₹4,200', lastVisit: '2 days ago', status: 'Active' },
      { name: 'Shiv Shakti Kirana', address: 'Manjalpur', outstanding: '₹1,100', lastVisit: 'Today', status: 'Needs Follow-up' },
      { name: 'Krishna Mart', address: 'Akota', outstanding: '₹2,800', lastVisit: '3 days ago', status: 'Active' }
    ];
  }

  private formatCurrency(value: number) {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  }
}
