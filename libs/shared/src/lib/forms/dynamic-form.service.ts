/**
 * Dynamic Form Service
 * - Forms are built from configuration, not hardcoded
 * - Support for complex validation rules
 * - Permission-driven field visibility
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormConfig, FormField, FormSubmission } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  private apiUrl = 'http://localhost:4000/api/forms';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  /**
   * Load form configuration from database
   */
  getFormConfig(formId: string, tenantId: string): Observable<FormConfig> {
    return this.http.get<FormConfig>(`${this.apiUrl}/${formId}`, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Build FormGroup from FormConfig
   * No hardcoded form validation - all from config
   */
  buildFormGroup(config: FormConfig): FormGroup {
    const formGroup: any = {};

    config.sections.forEach(section => {
      section.fields.forEach(field => {
        const validators = this.buildValidators(field);
        formGroup[field.name] = [
          { value: '', disabled: field.disabled },
          validators
        ];
      });
    });

    return this.fb.group(formGroup);
  }

  /**
   * Build validators from field configuration
   */
  private buildValidators(field: FormField): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validators) {
      field.validators.forEach(validator => {
        switch (validator.type) {
          case 'required':
            validators.push(Validators.required);
            break;
          case 'email':
            validators.push(Validators.email);
            break;
          case 'minLength':
            validators.push(Validators.minLength(validator.value));
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(validator.value));
            break;
          case 'min':
            validators.push(Validators.min(validator.value));
            break;
          case 'max':
            validators.push(Validators.max(validator.value));
            break;
          case 'pattern':
            validators.push(Validators.pattern(validator.value));
            break;
          case 'custom':
            validators.push(this.createCustomValidator(validator));
            break;
        }
      });
    }

    return validators;
  }

  /**
   * Create custom validator function
   */
  private createCustomValidator(validator: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      if (validator.condition && !validator.condition(control.value, control.parent?.value)) {
        return { custom: { message: validator.message } };
      }
      
      return null;
    };
  }

  /**
   * Get error message for field
   */
  getErrorMessage(field: FormField, errors: ValidationErrors | null): string {
    if (!errors) return '';

    if (field.validators) {
      const matchingValidator = field.validators.find(v => {
        return errors[v.type === 'minLength' ? 'minlength' : v.type];
      });

      if (matchingValidator) {
        return matchingValidator.message;
      }
    }

    return field.errorMessage || 'Invalid value';
  }

  /**
   * Get visible fields based on permissions and conditions
   */
  getVisibleFields(config: FormConfig, userPermissions: string[], formValue: any): FormField[] {
    const visibleFields: FormField[] = [];

    config.sections.forEach(section => {
      section.fields.forEach(field => {
        if (this.isFieldVisible(field, userPermissions, formValue)) {
          visibleFields.push(field);
        }
      });
    });

    return visibleFields;
  }

  /**
   * Check if field should be visible
   */
  private isFieldVisible(
    field: FormField,
    userPermissions: string[],
    formValue: any
  ): boolean {
    // Check permissions
    if (field.permissions && field.permissions.length > 0) {
      const hasPermission = field.permissions.some(p => userPermissions.includes(p));
      if (!hasPermission) return false;
    }

    // Check visibility conditions
    if (field.visibleWhen) {
      const condition = field.visibleWhen;
      const fieldValue = formValue[condition.field];

      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'notEquals':
          return fieldValue !== condition.value;
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        case 'greaterThan':
          return Number(fieldValue) > Number(condition.value);
        case 'lessThan':
          return Number(fieldValue) < Number(condition.value);
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case 'custom':
          return condition.condition ? condition.condition(fieldValue, formValue) : true;
      }
    }

    return true;
  }

  /**
   * Submit form data
   */
  submitForm(formId: string, data: any, tenantId: string): Observable<FormSubmission> {
    return this.http.post<FormSubmission>(`${this.apiUrl}/${formId}/submit`, data, {
      headers: { 'x-tenant-id': tenantId }
    });
  }

  /**
   * Get form submissions
   */
  getSubmissions(formId: string, tenantId: string): Observable<FormSubmission[]> {
    return this.http
      .get<{ submissions: FormSubmission[] }>(`${this.apiUrl}/${formId}/submissions`, {
        headers: { 'x-tenant-id': tenantId }
      })
      .pipe(
        map(response => response.submissions)
      );
  }

  /**
   * Fetch options for select/multi-select fields
   */
  getFieldOptions(field: FormField, tenantId: string): Observable<any[]> {
    if (!field.optionsUrl) {
      return Observable.of(field.options || []);
    }

    return this.http.get<{ options: any[] }>(field.optionsUrl, {
      headers: { 'x-tenant-id': tenantId }
    }).pipe(
      map(response => response.options)
    );
  }
}
