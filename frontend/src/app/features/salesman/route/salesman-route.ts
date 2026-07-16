import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SalesmanService } from '../../../services/salesman.service';
import { RetailerService } from '../../../services/retailer.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-salesman-route',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './salesman-route.html',
  styleUrls: ['./salesman-route.css']
})
export class SalesmanRouteComponent implements OnInit {
  routeStops: Array<{ retailer: string; area: string; time: string; priority: string }> = [];
  routePlan: string[] = [];
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
      this.routeStops = this.fallbackStops();
      this.routePlan = this.routeStops.map((stop) => stop.area);
      this.loading = false;
      return;
    }

    forkJoin({
      salesman: this.salesmanService.getSalesman(salesmanId).pipe(catchError((err) => {
        console.error('Salesman route profile load failed', err);
        return of(null);
      })),
      retailers: this.retailerService.getRetailers({ limit: 20 }).pipe(catchError((err) => {
        console.error('Salesman route retailer load failed', err);
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
        const source = assignedRetailers.length
          ? assignedRetailers
          : retailerList.filter((retailer: any) => ['active', 'approved', 'pending'].includes((retailer.status || '').toLowerCase()));

        this.routeStops = source.slice(0, 4).map((retailer: any, index: number) => this.toRouteStop(retailer, index));
        this.routePlan = this.routeStops.map((stop) => stop.area);

        if (!this.routeStops.length) {
          this.routeStops = this.fallbackStops();
          this.routePlan = this.routeStops.map((stop) => stop.area);
          this.error = 'No assigned retailers were found for today.';
        }
      },
      error: () => {
        this.error = 'Unable to load route data right now.';
        this.routeStops = this.fallbackStops();
        this.routePlan = this.routeStops.map((stop) => stop.area);
      }
    });
  }

  private fallbackStops(): Array<{ retailer: string; area: string; time: string; priority: string }> {
    return [
      { retailer: 'Jay Ambe Provision Store', area: 'Makarpura', time: '09:00', priority: 'High' },
      { retailer: 'Shiv Shakti Kirana', area: 'Manjalpur', time: '11:00', priority: 'Medium' },
      { retailer: 'Krishna Mart', area: 'Akota', time: '14:00', priority: 'High' },
      { retailer: 'Rajesh Cold Drinks', area: 'Gotri', time: '16:00', priority: 'Medium' }
    ];
  }

  private toRouteStop(retailer: any, index: number) {
    const name = typeof retailer === 'string' ? retailer : retailer?.name || retailer?.retailerName || `Assigned retailer ${index + 1}`;
    const area = retailer?.city || retailer?.area || retailer?.territory || retailer?.location?.city || 'Assigned area';
    return {
      retailer: name,
      area,
      time: `${9 + index * 2}:00`,
      priority: index % 2 === 0 ? 'High' : 'Medium'
    };
  }
}
