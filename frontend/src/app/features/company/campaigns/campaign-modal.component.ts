import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-campaign-modal',
  template: `
    <div class="card p-3" style="min-width:320px; max-width:560px;">
      <h5 class="mb-2">Create Campaign</h5>
      <div class="mb-2">
        <label class="form-label">Title</label>
        <input class="form-control form-control-sm" [(ngModel)]="title" />
      </div>
      <div class="mb-2">
        <label class="form-label">Ad Type</label>
        <select class="form-select form-select-sm" [(ngModel)]="adType">
          <option value="banner">Banner</option>
          <option value="shelf">Shelf</option>
        </select>
      </div>
      <div class="text-end">
        <button class="btn btn-secondary btn-sm me-2" (click)="cancel()">Cancel</button>
        <button class="btn btn-primary btn-sm" (click)="create()">Create</button>
      </div>
    </div>
  `
})
export class CampaignModalComponent {
  title = '';
  adType = 'banner';
  @Output() created = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  create() {
    this.created.emit({ title: this.title, adType: this.adType });
  }

  cancel() {
    this.cancelled.emit();
  }
}
