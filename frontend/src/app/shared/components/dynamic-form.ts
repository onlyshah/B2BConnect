import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

export type FormMode = 'create' | 'edit' | 'view' | 'approve';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'date' | 'tel';
  required?: boolean;
  readonly?: boolean;
  validators?: any[];
  options?: Array<{ label: string; value: any }>;
  hint?: string;
  icon?: string;
}

export interface FormConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  showCancel?: boolean;
  submitLabel?: string;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HasPermissionDirective],
  template: `
    <div class="form-container" [class]="'mode-' + mode">
      <div class="form-header">
        <h2>{{ config.title }}</h2>
        <p *ngIf="config.description" class="form-description">{{ config.description }}</p>
      </div>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dynamic-form">
        <div class="form-fields">
          <div *ngFor="let field of config.fields" class="form-group">
            <label [for]="field.name" class="field-label">
              {{ field.icon ? field.icon + ' ' : '' }}{{ field.label }}
              <span *ngIf="field.required" class="required">*</span>
            </label>
            
            <!-- Text Input -->
            <input 
              *ngIf="field.type === 'text'" 
              type="text"
              [id]="field.name"
              [formControlName]="field.name"
              [readonly]="field.readonly || mode === 'view'"
              class="form-input"
              [ngClass]="{'error': hasError(field.name)}"
            />
            
            <!-- Number Input -->
            <input 
              *ngIf="field.type === 'number'" 
              type="number"
              [id]="field.name"
              [formControlName]="field.name"
              [readonly]="field.readonly || mode === 'view'"
              class="form-input"
              [ngClass]="{'error': hasError(field.name)}"
            />
            
            <!-- Email Input -->
            <input 
              *ngIf="field.type === 'email'" 
              type="email"
              [id]="field.name"
              [formControlName]="field.name"
              [readonly]="field.readonly || mode === 'view'"
              class="form-input"
              [ngClass]="{'error': hasError(field.name)}"
            />
            
            <!-- Tel Input -->
            <input 
              *ngIf="field.type === 'tel'" 
              type="tel"
              [id]="field.name"
              [formControlName]="field.name"
              [readonly]="field.readonly || mode === 'view'"
              class="form-input"
              [ngClass]="{'error': hasError(field.name)}"
            />
            
            <!-- Date Input -->
            <input 
              *ngIf="field.type === 'date'" 
              type="date"
              [id]="field.name"
              [formControlName]="field.name"
              [readonly]="field.readonly || mode === 'view'"
              class="form-input"
              [ngClass]="{'error': hasError(field.name)}"
            />
            
            <!-- Textarea -->
            <textarea 
              *ngIf="field.type === 'textarea'"
              [id]="field.name"
              [formControlName]="field.name"
              [readonly]="field.readonly || mode === 'view'"
              class="form-input form-textarea"
              [ngClass]="{'error': hasError(field.name)}"
              rows="4"
            ></textarea>
            
            <!-- Select -->
            <select 
              *ngIf="field.type === 'select'"
              [id]="field.name"
              [formControlName]="field.name"
              [disabled]="field.readonly || mode === 'view'"
              class="form-input"
              [ngClass]="{'error': hasError(field.name)}"
            >
              <option value="">Select {{ field.label }}</option>
              <option *ngFor="let opt of field.options" [value]="opt.value">
                {{ opt.label }}
              </option>
            </select>
            
            <!-- Checkbox -->
            <div *ngIf="field.type === 'checkbox'" class="checkbox-group">
              <input 
                type="checkbox"
                [id]="field.name"
                [formControlName]="field.name"
                [disabled]="field.readonly || mode === 'view'"
                class="form-checkbox"
              />
              <label [for]="field.name" class="checkbox-label">
                {{ field.label }}
              </label>
            </div>
            
            <!-- Error Message -->
            <span *ngIf="hasError(field.name)" class="field-error">
              {{ getErrorMessage(field.name, field) }}
            </span>
            
            <!-- Hint -->
            <span *ngIf="field.hint" class="field-hint">{{ field.hint }}</span>
          </div>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn-primary" 
            [disabled]="mode === 'view' || (!form.valid && mode !== 'approve')"
            *ngIf="mode !== 'view'">
            {{ getSubmitButtonLabel() }}
          </button>
          
          <button 
            *ngIf="mode === 'approve'" 
            type="button" 
            class="btn-success"
            *appHasPermission="'approve'"
            (click)="onApprove.emit(form.value)">
            Approve
          </button>
          
          <button 
            *ngIf="mode === 'approve'" 
            type="button" 
            class="btn-danger"
            *appHasPermission="'reject'"
            (click)="onReject.emit(form.value)">
            Reject
          </button>
          
          <button 
            *ngIf="config.showCancel !== false" 
            type="button" 
            class="btn-secondary"
            (click)="onCancel.emit()">
            {{ mode === 'view' ? 'Close' : 'Cancel' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 600px;
    }
    
    .form-header {
      margin-bottom: 24px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 16px;
    }
    
    .form-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #212121;
    }
    
    .form-description {
      margin: 8px 0 0;
      font-size: 14px;
      color: #666;
    }
    
    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .field-label {
      font-weight: 600;
      font-size: 14px;
      color: #212121;
    }
    
    .required {
      color: #f44336;
    }
    
    .form-input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.3s;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }
    
    .form-input:disabled,
    .form-input[readonly] {
      background: #f5f5f5;
      color: #999;
      cursor: not-allowed;
    }
    
    .form-input.error {
      border-color: #f44336;
    }
    
    .form-textarea {
      resize: vertical;
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .form-checkbox {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }
    
    .checkbox-label {
      cursor: pointer;
      font-size: 14px;
      color: #212121;
    }
    
    .field-error {
      font-size: 12px;
      color: #f44336;
    }
    
    .field-hint {
      font-size: 12px;
      color: #999;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    .btn-primary:hover:not(:disabled) { background: #1565c0; }
    
    .btn-success {
      background: #4caf50;
      color: white;
    }
    .btn-success:hover:not(:disabled) { background: #45a049; }
    
    .btn-danger {
      background: #f44336;
      color: white;
    }
    .btn-danger:hover:not(:disabled) { background: #da190b; }
    
    .btn-secondary {
      background: #e0e0e0;
      color: #212121;
    }
    .btn-secondary:hover:not(:disabled) { background: #bdbdbd; }
    
    .mode-view button[type="submit"] {
      display: none;
    }
  `]
})
export class DynamicFormComponent implements OnInit {
  @Input() config!: FormConfig;
  @Input() mode: FormMode = 'create';
  @Input() initialData?: Record<string, any>;
  
  @Output() onSubmit = new EventEmitter<Record<string, any>>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onApprove = new EventEmitter<Record<string, any>>();
  @Output() onReject = new EventEmitter<Record<string, any>>();
  
  form!: FormGroup;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit() {
    this.buildForm();
  }
  
  buildForm() {
    const group: Record<string, any> = {};
    
    for (const field of this.config.fields) {
      const validators = [...(field.validators || [])];
      
      if (field.required) {
        validators.push(Validators.required);
      }
      
      if (field.type === 'email') {
        validators.push(Validators.email);
      }
      
      const value = this.initialData?.[field.name] || (field.type === 'checkbox' ? false : '');
      group[field.name] = [
        { value, disabled: field.readonly || this.mode === 'view' },
        validators
      ];
    }
    
    this.form = this.fb.group(group);
  }
  
  hasError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  getErrorMessage(fieldName: string, field: FormFieldConfig): string {
    const control = this.form.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${field.label} is required`;
    }
    
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    
    if (control?.hasError('pattern')) {
      return `${field.label} format is invalid`;
    }
    
    return `${field.label} is invalid`;
  }
  
  getSubmitButtonLabel(): string {
    switch (this.mode) {
      case 'create':
        return this.config.submitLabel || 'Create';
      case 'edit':
        return this.config.submitLabel || 'Update';
      case 'approve':
        return this.config.submitLabel || 'Review';
      default:
        return this.config.submitLabel || 'Submit';
    }
  }
  
  onSubmit() {
    if (this.form.valid || this.mode === 'approve') {
      this.onSubmit.emit(this.form.getRawValue());
    }
  }
}
