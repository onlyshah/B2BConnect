import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SampleService } from '../../../services/sample.service';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';

@Component({
  selector: 'app-sample-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiButtonComponent],
  template: `
    <div class="p-4">
      <h2>Sample Requests</h2>
      <div *ngIf="message" class="p-3 rounded mt-3" [class.text-green-700]="!error" [class.text-red-700]="error">{{ message }}</div>
      <form [formGroup]="form" (ngSubmit)="submit()" class="mt-4 space-y-3">
        <input formControlName="retailerId" placeholder="Retailer ID" class="w-full border p-2" />
        <input formControlName="productName" placeholder="Product Name" class="w-full border p-2" />
        <ui-button type="submit" variant="primary">Request Sample</ui-button>
      </form>
      <div *ngIf="loading" class="mt-4">Loading sample requests...</div>
      <div *ngIf="!loading && samples.length === 0" class="mt-4">No sample requests yet.</div>
      <ul *ngIf="samples.length" class="mt-4 space-y-2">
        <li *ngFor="let sample of samples" class="border p-3 rounded">
          <div><strong>{{ sample.productName || 'Sample' }}</strong></div>
          <div>Retailer: {{ sample.retailerId }}</div>
          <div>Status: {{ sample.status || 'pending' }}</div>
        </li>
      </ul>
    </div>
  `
})
export class SampleListComponent implements OnInit {
  form: FormGroup;
  samples: any[] = [];
  loading = true;
  message: string | null = null;
  error = false;

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
