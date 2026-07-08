import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../../services/campaign.service';
import { AuthService } from '../../../services/auth.service';
import { ResponseHandlerService } from '../../../services/response-handler.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaigns.html',
  styleUrls: ['./campaigns.css']
})
export class CampaignsComponent implements OnInit, OnDestroy {
  campaigns: any[] = [];
  loading = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(
    private campaignService: CampaignService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
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
        try { this.cd.detectChanges(); } catch(e) {}
      },
      error: (err) => {
        console.error('Failed to load campaigns', err);
        this.message = 'Unable to load campaigns.';
        this.loading = false;
        try { this.cd.detectChanges(); } catch(e) {}
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

