import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionService } from '../../services/collection.service';
import { AuthService } from '../../services/auth.service';
import { UiButtonComponent } from '../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../shared/ui/components/ui-page-shell';
import { UiBadgeComponent } from '../../shared/ui/components/ui-badge';
import { UiEmptyStateComponent } from '../../shared/ui/components/ui-empty-state';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiButtonComponent, UiCardComponent, UiPageShellComponent, UiBadgeComponent, UiEmptyStateComponent],
  template: `
    <ui-page-shell title="Collections" eyebrow="finance" description="Review payments recorded across retailers and keep status tracking transparent.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Filter</ui-button>
        <ui-button>+ Record collection</ui-button>
      </ng-container>

      <ui-empty-state *ngIf="isLoading" title="Loading collections" description="Fetching recent payment activity."></ui-empty-state>

      <div class="page-grid" *ngIf="!isLoading">
        <ui-card *ngFor="let item of filteredCollections" [title]="item.retailer?.name || item.retailer || 'Retailer'" [subtitle]="item.paymentMode || 'Cash'">
          <div class="collection-card__meta">
            <ui-badge [type]="item.status || 'pending'">{{ item.status || 'recorded' }}</ui-badge>
            <span class="collection-card__value">{{ item.amountCollected || 0 | currency }}</span>
          </div>
          <div class="collection-card__footer">
            <span>Reference: {{ item.referenceId || '—' }}</span>
            <span>{{ item.collectedAt | date:'mediumDate' }}</span>
          </div>
        </ui-card>
      </div>

      <div class="state-card" *ngIf="!isLoading && !filteredCollections.length">
        <p>No collection records are available yet.</p>
      </div>
    </ui-page-shell>
  `,
  styles: [
    `.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.collection-card__meta,.collection-card__footer{display:flex;justify-content:space-between;gap:10px;align-items:center}.collection-card__footer{margin-top:12px;font-size:.84rem;color:var(--text-muted)}.state-card{padding:16px;border:1px dashed var(--border);border-radius:12px;background:var(--surface-alt);color:var(--text-muted)}`
  ]
})
export class CollectionsComponent implements OnInit {
  collections: any[] = [];
  filteredCollections: any[] = [];
  isLoading = true;
  showForm = false;
  formData: FormGroup;
  retailers: any[] = [];
  
  statusOptions = ['recorded', 'verified', 'reconciled'];
  paymentModes = ['cash', 'cheque', 'bank-transfer', 'digital'];

  constructor(
    private collectionService: CollectionService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.formData = this.fb.group({
      retailer: ['', Validators.required],
      amountCollected: ['', [Validators.required, Validators.min(0)]],
      paymentMode: ['', Validators.required],
      referenceId: ['']
    });
  }

  ngOnInit() {
    this.loadCollections();
  }

  loadCollections(filters?: any) {
    this.isLoading = true;
    this.collectionService.getCollections(filters).subscribe({
      next: (response: any) => {
        this.collections = response.data || response;
        this.filteredCollections = this.collections;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading collections:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.formData.invalid) return;
    
    const data = {
      ...this.formData.value,
      distributor: this.authService.getCurrentUserSync()?.distributorId || null
    };

    this.collectionService.recordCollection(data).subscribe({
      next: () => {
        this.showForm = false;
        this.formData.reset();
        this.loadCollections();
      },
      error: (err) => console.error('Error recording collection:', err)
    });
  }

  onFilterChange(status: string) {
    if (status === 'all') {
      this.filteredCollections = this.collections;
    } else {
      this.filteredCollections = this.collections.filter(c => c.status === status);
    }
  }
}
