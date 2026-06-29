import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DashboardService } from '../../../services/dashboard.service';
import { CompanyService } from '../../../services/company.service';
import { DistributorService } from '../../../services/distributor.service';
import { RetailerService } from '../../../services/retailer.service';
import { OrderService } from '../../../services/order.service';
import { MetricCardComponent, MetricData } from '../../../shared/components/metric-card';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent],
  template: `
    <section class="page-card">
      <div class="hero">
        <div>
          <p class="eyebrow">Operations overview</p>
          <h2>Platform health and approval queue</h2>
          <p class="supporting-text">Monitor tenant growth, approvals, and order volume from a single control surface.</p>
        </div>
        <span class="pill">Live monitoring</span>
      </div>

      <div class="card" *ngIf="loading">Loading platform metrics...</div>
      <div class="card error" *ngIf="error">{{ error }}</div>

      <div class="metrics-grid" *ngIf="!loading">
        <app-metric-card *ngFor="let metric of metrics" [metric]="metric"></app-metric-card>
      </div>

      <div class="content-grid" *ngIf="!loading">
        <section class="card">
          <div class="card-header">
            <h3>Approval queue</h3>
            <a routerLink="/super-admin/approvals">Open queue</a>
          </div>
          <div class="list" *ngIf="approvalQueue.length; else emptyApprovalQueue">
            <div class="list-item" *ngFor="let item of approvalQueue">
              <div>
                <strong>{{ item.name }}</strong>
                <p>{{ item.kind || 'Needs attention' }}</p>
              </div>
              <span class="pill">{{ item.status }}</span>
            </div>
          </div>
          <ng-template #emptyApprovalQueue>
            <p class="muted">No approvals are pending at the moment.</p>
          </ng-template>
        </section>

        <section class="card">
          <div class="card-header">
            <h3>Recent companies</h3>
            <a routerLink="/super-admin/companies">Manage tenants</a>
          </div>
          <div class="list" *ngIf="recentCompanies.length; else emptyCompanies">
            <div class="list-item" *ngFor="let company of recentCompanies">
              <div>
                <strong>{{ company.name || company.companyName || 'Company' }}</strong>
                <p>{{ company.email || company.contactEmail || 'No contact listed' }}</p>
              </div>
            </div>
          </div>
          <ng-template #emptyCompanies>
            <p class="muted">No tenant profiles are available yet.</p>
          </ng-template>
        </section>
      </div>
    </section>
  `,
  styles: [`.page-card{display:flex;flex-direction:column;gap:16px;background:white;border:1px solid #e2e8f0;border-radius:18px;padding:20px;box-shadow:0 8px 30px rgba(15,23,42,.04)}.hero{display:flex;justify-content:space-between;align-items:center;gap:16px}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;color:#64748b;margin:0 0 4px}.hero h2{margin:0;font-size:1.2rem}.supporting-text{margin:6px 0 0;color:#64748b}.pill{background:#eff6ff;color:#1d4ed8;padding:8px 10px;border-radius:999px;font-weight:600}.metrics-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px}.content-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.card-header a{text-decoration:none;color:#2563eb;font-weight:600}.list{display:flex;flex-direction:column;gap:10px}.list-item{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #e2e8f0}.list-item:last-child{border-bottom:none}.list-item p{margin:4px 0 0;color:#64748b}.muted{color:#64748b}.error{color:#dc2626}@media(max-width:760px){.hero,.content-grid,.metrics-grid{grid-template-columns:1fr;display:grid}.hero{display:grid}}`] 
})
export class SuperAdminDashboardComponent implements OnInit {
  metrics: MetricData[] = [];
  approvalQueue: any[] = [];
  recentCompanies: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private companyService: CompanyService,
    private distributorService: DistributorService,
    private retailerService: RetailerService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    forkJoin({
      summary: this.dashboardService.getSummary().pipe(
        catchError((err) => {
          console.error('Super admin summary load failed', err);
          this.error = 'Some summary data could not be loaded.';
          return of({});
        })
      ),
      companies: this.companyService.getCompanies().pipe(
        catchError((err) => {
          console.error('Super admin companies load failed', err);
          this.error = this.error || 'Some company data could not be loaded.';
          return of([]);
        })
      ),
      distributors: this.distributorService.getDistributors().pipe(
        catchError((err) => {
          console.error('Super admin distributors load failed', err);
          this.error = this.error || 'Some distributor data could not be loaded.';
          return of([]);
        })
      ),
      retailers: this.retailerService.getRetailers().pipe(
        catchError((err) => {
          console.error('Super admin retailers load failed', err);
          this.error = this.error || 'Some retailer data could not be loaded.';
          return of([]);
        })
      ),
      orders: this.orderService.getOrders().pipe(
        catchError((err) => {
          console.error('Super admin orders load failed', err);
          this.error = this.error || 'Some order data could not be loaded.';
          return of([]);
        })
      )
    }).pipe(finalize(() => (this.loading = false))).subscribe({
      next: ({ summary, companies, distributors, retailers, orders }) => {
        const companyList = this.toArray(companies);
        const distributorList = this.toArray(distributors);
        const retailerList = this.toArray(retailers);
        const orderList = this.toArray(orders);

        const pendingDistributors = distributorList
          .filter((item: any) => ['pending', 'requested', 'submitted', 'review', 'in_review', 'under_review'].includes((item.status || '').toLowerCase()))
          .map((item: any) => ({ ...item, kind: 'Distributor', name: item.name || item.companyName || 'Distributor', status: item.status || 'pending' }));

        const pendingRetailers = retailerList
          .filter((item: any) => ['pending', 'requested', 'submitted', 'review', 'in_review', 'under_review'].includes((item.status || '').toLowerCase()))
          .map((item: any) => ({ ...item, kind: 'Retailer', name: item.name || item.retailerName || 'Retailer', status: item.status || 'pending' }));

        this.approvalQueue = [...pendingDistributors, ...pendingRetailers].slice(0, 8);
        this.recentCompanies = companyList.slice(0, 5);
        this.metrics = [
          { label: 'Companies', value: companyList.length, color: 'primary', icon: '🏢' },
          { label: 'Distributors', value: distributorList.length, color: 'info', icon: '🚚' },
          { label: 'Pending approvals', value: this.approvalQueue.length, color: 'warning', icon: '⏳' },
          { label: 'Open orders', value: orderList.filter((item: any) => ['pending', 'requested', 'processing'].includes((item.status || '').toLowerCase())).length, color: 'success', icon: '🛒' }
        ];
        if (!this.error) {
          this.error = null;
        }
      },
      error: (err) => {
        console.error('Super admin dashboard load failed', err);
        this.error = 'Unable to load platform overview right now.';
      }
    });
  }

  private toArray(value: any): any[] {
    if (Array.isArray(value)) {
      return value;
    }

    if (Array.isArray(value?.data)) {
      return value.data;
    }

    return [];
  }
}
