import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../../services/campaign.service';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { AuthService } from '../../../services/auth.service';
import { ResponseHandlerService } from '../../../services/response-handler.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';
import { UiListToolbarComponent } from '../../../shared/ui/components/ui-list-toolbar';
import { UiFormFieldComponent } from '../../../shared/ui/components/ui-form-field';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiCardComponent, UiEmptyStateComponent, UiPageShellComponent, UiListToolbarComponent, UiFormFieldComponent],
  template: `
    <ui-page-shell title="Campaigns" eyebrow="marketing" description="Create and review promotional campaigns across your channels.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Filter</ui-button>
        <ui-button (click)="createCampaign()">+ New campaign</ui-button>
      </ng-container>

      <ui-list-toolbar title="Campaign library" subtitle="Keep your promotions organised and easy to review."></ui-list-toolbar>

      <ui-empty-state *ngIf="loading" title="Loading campaigns" description="Fetching the latest promotions and ad assets."></ui-empty-state>
      <ui-empty-state *ngIf="message && !loading" title="We hit a snag" [description]="message" tone="error"></ui-empty-state>

      <ui-form-field label="Search campaigns" hint="Use the shared field primitive for future filters">
        <input type="text" placeholder="Search campaigns" />
      </ui-form-field>

      <div class="page-grid" *ngIf="!loading && !message">
        <ui-card *ngFor="let campaign of campaigns" [title]="campaign.title || 'Untitled campaign'" [subtitle]="campaign.adType || 'Promotion'">
          <div class="campaign-card__meta">
            <span>{{ campaign.status || 'draft' }}</span>
            <span>{{ campaign.mediaUrl || 'No media URL' }}</span>
          </div>
        </ui-card>
      </div>

      <ui-card *ngIf="campaignModalOpen" title="Create campaign" subtitle="Launch a new promotion with media and status">
        <div class="form-grid">
          <label>
            <span>Title</span>
            <input [(ngModel)]="newCampaignTitle" />
          </label>
          <label>
            <span>Ad type</span>
            <select [(ngModel)]="newCampaignAdType">
              <option value="generic">Generic</option>
              <option value="offer">Offer</option>
              <option value="festival">Festival</option>
            </select>
          </label>
          <label>
            <span>Media URL</span>
            <input [(ngModel)]="newCampaignMediaUrl" />
          </label>
        </div>
        <div class="modal-actions">
          <ui-button variant="secondary" (click)="campaignModalOpen = false">Cancel</ui-button>
          <ui-button (click)="submitCreateCampaign()">Create campaign</ui-button>
        </div>
      </ui-card>
    </ui-page-shell>
  `,
  styles: [
    `.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.campaign-card__meta{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;color:var(--text-muted)}.form-grid{display:grid;gap:12px}.form-grid label{display:grid;gap:6px}.form-grid input,.form-grid select{width:100%;border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:var(--surface);color:var(--text)}.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:12px}`
  ]
})
export class CampaignsComponent implements OnInit, OnDestroy {
  campaigns: any[] = [];
  loading = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(
    private campaignService: CampaignService,
    private authService: AuthService,
    private responseHandler: ResponseHandlerService
  ) {}

  ngOnInit() {
    this.loadCampaigns();

    this.authService.currentUser$
      .pipe(filter(user => !!user), takeUntil(this.destroy$))
      .subscribe(() => this.loadCampaigns());
  }

  loadCampaigns() {
    this.loading = true;
    this.campaignService.getCampaigns({ page: 1, limit: 20 }).subscribe({
      next: (data) => {
        this.campaigns = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load campaigns', err);
        this.message = 'Unable to load campaigns.';
        this.loading = false;
      }
    });
  }

  // Modal-driven campaign creation
  campaignModalOpen = false;
  newCampaignTitle = '';
  newCampaignAdType = 'generic';
  newCampaignMediaUrl = '';

  createCampaign() {
    this.newCampaignTitle = '';
    this.newCampaignAdType = 'generic';
    this.campaignModalOpen = true;
  }

  submitCreateCampaign() {
    if (!this.newCampaignTitle) {
      this.responseHandler.showError('Title is required');
      return;
    }

    if (!this.newCampaignMediaUrl) {
      this.responseHandler.showError('Media URL is required');
      return;
    }

    const payload: any = { title: this.newCampaignTitle, adType: this.newCampaignAdType, status: 'draft', mediaUrl: this.newCampaignMediaUrl };
    this.responseHandler.setLoading(true);
    this.campaignService.createCampaign(payload).subscribe({
      next: (res) => {
        this.responseHandler.setLoading(false);
        this.responseHandler.showSuccess('Campaign created');
        this.campaignModalOpen = false;
        this.loadCampaigns();
      },
      error: (err) => {
        this.responseHandler.setLoading(false);
        console.error('Failed to create campaign', err);
        if (err?.error?.errors) {
          this.responseHandler.showValidationErrors(err.error.errors);
        } else {
          this.responseHandler.showError('Unable to create campaign');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

