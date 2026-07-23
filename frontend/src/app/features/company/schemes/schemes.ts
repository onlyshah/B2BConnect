import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchemeService } from '../../../services/scheme.service';
import { AuthService } from '../../../services/auth.service';
import { ResponseHandlerService } from '../../../services/response-handler.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-schemes',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiCardComponent, UiEmptyStateComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Schemes" eyebrow="growth" description="Create, review, and manage promotional and incentive schemes for distributors and retailers.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Filter</ui-button>
        <ui-button (click)="createScheme()">+ New scheme</ui-button>
      </ng-container>

      <ui-empty-state *ngIf="loading" title="Loading schemes" description="Fetching the latest scheme activity."></ui-empty-state>
      <ui-empty-state *ngIf="message && !loading" title="We hit a snag" [description]="message" tone="error"></ui-empty-state>

      <div class="module-grid" *ngIf="!loading && !message">
        <ui-card *ngFor="let scheme of schemes" [title]="scheme.title || 'Untitled scheme'" [subtitle]="scheme.status || 'draft'">
          <div class="module-list">
            <div class="module-row"><span>Expiry</span><strong>{{ scheme.expiresAt ? (scheme.expiresAt | date:'mediumDate') : 'No expiry' }}</strong></div>
            <div class="module-row"><span>Audience</span><strong>{{ scheme.audience || 'All partners' }}</strong></div>
          </div>
        </ui-card>
      </div>

      <ui-card *ngIf="schemeModalOpen" title="Create scheme" subtitle="Launch a new incentive or promotion">
        <div class="form-grid">
          <label>
            <span>Title</span>
            <input [(ngModel)]="newSchemeTitle" />
          </label>
          <label>
            <span>Expiry date</span>
            <input type="date" [(ngModel)]="newSchemeExpiresAt" />
          </label>
        </div>
        <div class="modal-actions">
          <ui-button variant="secondary" (click)="schemeModalOpen = false">Cancel</ui-button>
          <ui-button (click)="submitCreateScheme()">Create scheme</ui-button>
        </div>
      </ui-card>
    </ui-page-shell>
  `,
  styles: []
})
export class SchemesComponent implements OnInit, OnDestroy {
  schemes: any[] = [];
  loading = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(
    private schemeService: SchemeService,
    private authService: AuthService,
    private responseHandler: ResponseHandlerService
  ) {}

  ngOnInit() {
    this.loadSchemes();

    this.authService.currentUser$
      .pipe(filter(user => !!user), takeUntil(this.destroy$))
      .subscribe(() => this.loadSchemes());
  }

  loadSchemes() {
    this.loading = true;
    this.schemeService.getSchemes({ page: 1, limit: 20 }).subscribe({
      next: (data) => {
        this.schemes = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load schemes', err);
        this.message = 'Unable to load schemes.';
        this.loading = false;
      }
    });
  }

  // Modal-driven scheme creation
  schemeModalOpen = false;
  newSchemeTitle = '';
  newSchemeExpiresAt: string | null = null;

  createScheme() {
    this.newSchemeTitle = '';
    this.newSchemeExpiresAt = null;
    this.schemeModalOpen = true;
  }

  submitCreateScheme() {
    if (!this.newSchemeTitle) {
      this.responseHandler.showError('Title is required');
      return;
    }

    const payload: any = { title: this.newSchemeTitle, status: 'draft' };
    if (this.newSchemeExpiresAt) payload.expiresAt = this.newSchemeExpiresAt;

    this.responseHandler.setLoading(true);
    this.schemeService.createScheme(payload).subscribe({
      next: () => {
        this.responseHandler.setLoading(false);
        this.responseHandler.showSuccess('Scheme created');
        this.schemeModalOpen = false;
        this.loadSchemes();
      },
      error: (e) => {
        this.responseHandler.setLoading(false);
        console.error('Failed to create scheme', e);
        if (e?.error?.errors) {
          this.responseHandler.showValidationErrors(e.error.errors);
        } else {
          this.responseHandler.showError('Unable to create scheme');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

