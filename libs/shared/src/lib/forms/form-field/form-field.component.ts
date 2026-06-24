/**
 * Form Field Component
 * - Renders any field type
 * - Single component for all field types
 * - Permission-based visibility
 */

import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { FormField, FormConfig } from '@shared/models';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-field" [ngClass]="'field-' + field.type">
      <!-- Label -->
      <label [for]="field.name" class="field-label">
        {{ field.label }}
        <span *ngIf="field.required" class="required-indicator">*</span>
      </label>

      <!-- Input Field -->
      <input
        *ngIf="field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number'"
        [type]="field.type"
        [id]="field.name"
        [formControl]="getControl()"
        [placeholder]="field.placeholder"
        class="field-input"
      />

      <!-- Textarea Field -->
      <textarea
        *ngIf="field.type === 'textarea'"
        [id]="field.name"
        [formControl]="getControl()"
        [placeholder]="field.placeholder"
        [rows]="field.rows || 4"
        [cols]="field.cols || 50"
        class="field-textarea">
      </textarea>

      <!-- Select Field -->
      <select
        *ngIf="field.type === 'select'"
        [id]="field.name"
        [formControl]="getControl()"
        class="field-select">
        <option value="">{{ field.placeholder || 'Select...' }}</option>
        <option *ngFor="let option of field.options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Multi-Select Field -->
      <select
        *ngIf="field.type === 'multi-select'"
        [id]="field.name"
        [formControl]="getControl()"
        multiple
        class="field-select">
        <option *ngFor="let option of field.options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Checkbox Field -->
      <input
        *ngIf="field.type === 'checkbox'"
        type="checkbox"
        [id]="field.name"
        [formControl]="getControl()"
        class="field-checkbox"
      />

      <!-- Radio Field -->
      <div *ngIf="field.type === 'radio'" class="field-radio-group">
        <label *ngFor="let option of field.options" class="radio-option">
          <input
            type="radio"
            [value]="option.value"
            [formControl]="getControl()"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>

      <!-- Date Field -->
      <input
        *ngIf="field.type === 'date'"
        type="date"
        [id]="field.name"
        [formControl]="getControl()"
        class="field-input"
      />

      <!-- Datetime Field -->
      <input
        *ngIf="field.type === 'datetime'"
        type="datetime-local"
        [id]="field.name"
        [formControl]="getControl()"
        class="field-input"
      />

      <!-- File Field -->
      <input
        *ngIf="field.type === 'file' || field.type === 'image'"
        [type]="field.type === 'image' ? 'file' : 'file'"
        [accept]="field.type === 'image' ? 'image/*' : '*/*'"
        [id]="field.name"
        (change)="onFileChange($event)"
        class="field-input"
      />

      <!-- Hint Text -->
      <p *ngIf="field.hint" class="field-hint">{{ field.hint }}</p>

      <!-- Error Message -->
      <div *ngIf="getControl()?.invalid && getControl()?.touched" class="field-error">
        {{ getErrorMessage() }}
      </div>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 0;
    }

    .field-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #1f2937;
      font-size: 0.95rem;
    }

    .required-indicator {
      color: #dc2626;
      margin-left: 0.25rem;
    }

    .field-input,
    .field-textarea,
    .field-select {
      width: 100%;
      padding: 0.625rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.95rem;
      font-family: inherit;
      transition: all 0.2s;
    }

    .field-input:focus,
    .field-textarea:focus,
    .field-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .field-input:invalid,
    .field-textarea:invalid,
    .field-select:invalid {
      border-color: #dc2626;
    }

    .field-checkbox,
    .field-radio-group input[type="radio"] {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .field-radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .radio-option span {
      margin-left: 0.25rem;
    }

    .field-hint {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .field-error {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      color: #dc2626;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .field-error::before {
      content: '⚠';
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent implements OnInit {
  @Input() field!: FormField;
  @Input() formGroup!: FormGroup;
  @Input() formConfig?: FormConfig;

  ngOnInit(): void {
    // Field initialization if needed
  }

  getControl(): FormControl {
    return this.formGroup.get(this.field.name) as FormControl;
  }

  getErrorMessage(): string {
    const control = this.getControl();
    if (!control?.errors) return '';

    const errors = control.errors;
    
    if (this.field.validators) {
      for (const validator of this.field.validators) {
        if (errors[validator.type === 'minLength' ? 'minlength' : validator.type]) {
          return validator.message;
        }
      }
    }

    return this.field.errorMessage || 'Invalid value';
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.getControl().setValue(file);
    }
  }
}
