import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SampleService } from '../../../services/sample.service';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';
import { UiListToolbarComponent } from '../../../shared/ui/components/ui-list-toolbar';
import { UiFormFieldComponent } from '../../../shared/ui/components/ui-form-field';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiDataTableComponent, UiDataTableColumn } from '../../../shared/ui/components/ui-data-table';

@Component({
  selector: 'app-sample-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiButtonComponent, UiPageShellComponent, UiListToolbarComponent, UiFormFieldComponent, UiEmptyStateComponent, UiDataTableComponent],
  template: `
    <ui-page-shell title="Sample requests" eyebrow="operations" description="Capture and track retailer sample requests from one place.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Export</ui-button>
      </ng-container>

      <ui-list-toolbar title="Request intake" subtitle="Review requests and move them through the sample workflow.">
        <ng-container slot="actions">
          <ui-button variant="secondary">Filter</ui-button>
        </ng-container>
      </ui-list-toolbar>

      <div *ngIf="message" class="empty-state success" [class.error]="error" style="margin-bottom: 8px;">{{ message }}</div>

      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid;gap:10px;">
        <ui-form-field label="Retailer ID" hint="Reference the retailer making the request">
          <input formControlName="retailerId" placeholder="Retailer ID" />
        </ui-form-field>
        <ui-form-field label="Product name" hint="Describe the sample being requested">
          <input formControlName="productName" placeholder="Product Name" />
        </ui-form-field>
        <ui-button type="submit" variant="primary">Request Sample</ui-button>
      </form>

      <ui-data-table
        title="Recent requests"
        subtitle="A reusable table for sample activity"
        [columns]="overviewColumns"
        [rows]="samples"
        [loading]="loading"
        emptyTitle="No sample requests yet"
        emptyDescription="Create your first sample request to start tracking demand."
      ></ui-data-table>

      <ui-empty-state *ngIf="loading" title="Loading samples" description="Fetching the latest requests from the workspace."></ui-empty-state>
      <ui-empty-state *ngIf="!loading && !samples.length" title="No sample requests yet" description="Submit your first request to kick off the workflow." tone="neutral"></ui-empty-state>
    </ui-page-shell>
  `
})
export class SampleListComponent implements OnInit {
  form: FormGroup;
  samples: any[] = [];
  loading = true;
  message: string | null = null;
  error = false;
  overviewColumns: UiDataTableColumn[] = [
    { key: 'productName', label: 'Product' },
    { key: 'retailerId', label: 'Retailer' },
    { key: 'status', label: 'Status', type: 'status' }
  ];

  constructor(private fb: FormBuilder, private sampleService: SampleService) {
    this.form = this.fb.group({
      retailerId: ['', Validators.required],
      productName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSamples();
  }

  loadSamples(): void {
    this.loading = true;
    this.sampleService.getSamples().subscribe({
      next: (data) => {
        this.samples = data;
        this.loading = false;
      },
      error: () => {
        this.message = 'Unable to load sample requests';
        this.error = true;
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.message = 'Please enter retailer and product details';
      this.error = true;
      return;
    }

    this.sampleService.createSample({ ...this.form.value, status: 'pending' }).subscribe({
      next: () => {
        this.form.reset();
        this.message = 'Sample request submitted';
        this.error = false;
        this.loadSamples();
      },
      error: () => {
        this.message = 'Unable to submit sample request';
        this.error = true;
      }
    });
  }
}
