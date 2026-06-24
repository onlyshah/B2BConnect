/**
 * Dynamic Form Component
 * - Renders ANY form from configuration
 * - Single component for all form types
 * - No hardcoded forms per role
 */

import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { FormConfig } from '@shared/models';
import { DynamicFormService } from './dynamic-form.service';
import { FormFieldComponent } from './form-field/form-field.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="dynamic-form">
      <!-- Form Sections -->
      <div *ngFor="let section of formConfig?.sections" class="form-section">
        <div class="section-header" *ngIf="section.title">
          <h3 class="section-title">{{ section.title }}</h3>
          <p *ngIf="section.description" class="section-description">{{ section.description }}</p>
        </div>

        <div [ngClass]="'form-layout-' + (formConfig?.layout || 'single-column')">
          <app-form-field
            *ngFor="let field of section.fields; trackBy: trackByFieldName"
            [field]="field"
            [formGroup]="formGroup"
            [formConfig]="formConfig"
          ></app-form-field>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button 
          type="submit"
          [disabled]="!formGroup.valid || isSubmitting"
          class="btn btn-primary">
          {{ isSubmitting ? 'Submitting...' : (formConfig?.submitLabel || 'Submit') }}
        </button>
        <button 
          type="button"
          (click)="onCancel()"
          class="btn btn-secondary">
          {{ formConfig?.cancelLabel || 'Cancel' }}
        </button>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>
    </form>
  `,
  styles: [`
    .dynamic-form {
      padding: 2rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section:last-child {
      margin-bottom: 1rem;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .section-description {
      margin: 0.5rem 0 0 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .form-layout-single-column {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .form-layout-two-column {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .form-layout-three-column {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .form-layout-two-column,
      .form-layout-three-column {
        grid-template-columns: 1fr;
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-start;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #1f2937;
    }

    .btn-secondary:hover {
      background: #d1d5db;
    }

    .alert {
      padding: 1rem;
      border-radius: 0.375rem;
      margin-top: 1rem;
    }

    .alert-success {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
    }

    .alert-error {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnInit {
  @Input() formConfig!: FormConfig;
  @Output() submitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  formGroup!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formService: DynamicFormService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.formConfig) {
      this.formGroup = this.formService.buildFormGroup(this.formConfig);
    }
  }

  onSubmit(): void {
    if (!this.formGroup.valid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.isSubmitting = true;
    this.submitted.emit(this.formGroup.getRawValue());
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  trackByFieldName(index: number, field: any): string {
    return field.name;
  }
}
