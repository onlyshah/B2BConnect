/**
 * Dynamic Form Configuration Model
 * Forms are built from configuration, not hardcoded for each role
 */

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multi-select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'image'
  | 'autocomplete'
  | 'lookup'
  | 'geolocation'
  | 'rich-text'
  | 'slider'
  | 'toggle'
  | 'color'
  | 'tags'
  | 'phone'
  | 'currency'
  | 'percentage';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  order: number;
  section?: string; // Organize fields in sections
  
  // Validation
  validators?: FieldValidator[];
  errorMessage?: string;
  
  // Options for select, multi-select, radio, checkbox
  options?: FormOption[];
  optionsUrl?: string; // Fetch options from API
  
  // Dynamic visibility based on permissions
  permissions?: string[]; // Show only if user has ANY of these permissions
  
  // Dynamic visibility based on other field values
  visibleWhen?: FieldVisibilityCondition;
  
  // Help text
  hint?: string;
  
  // Appearance
  rows?: number; // For textarea
  cols?: number; // For textarea
  icon?: string;
  tooltip?: string;
  
  // Dependencies
  dependsOn?: string[]; // Other field names that affect this field
}

export interface FormOption {
  label: string;
  value: any;
  description?: string;
  disabled?: boolean;
  group?: string; // For grouped options
}

export interface FieldValidator {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom' | 'minLength' | 'maxLength' | 'email';
  value?: any;
  message: string;
  condition?: (value: any, formValue: any) => boolean;
}

export interface FieldVisibilityCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'custom';
  value?: any;
  condition?: (fieldValue: any, formValue: any) => boolean;
}

export interface FormSection {
  name: string;
  title: string;
  description?: string;
  collapsed?: boolean;
  fields: FormField[];
  permissions?: string[]; // Show entire section if user has ANY permission
}

export interface FormConfig {
  id: string;
  name: string;
  title: string;
  description?: string;
  sections: FormSection[];
  permissions?: string[]; // Array of permission strings to access form
  layout?: 'single-column' | 'two-column' | 'three-column';
  submitLabel?: string;
  cancelLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  redirectUrl?: string; // Redirect after successful submission
  showSteps?: boolean; // For multi-step forms
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  formId: string;
  userId: string;
  tenantId: string;
  data: Record<string, any>;
  submittedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  errors?: Record<string, string>;
}

// Predefined Forms
export const PRODUCT_FORM_CONFIG: FormConfig = {
  id: 'product-form',
  name: 'product-form',
  title: 'Product Details',
  sections: [
    {
      name: 'basic',
      title: 'Basic Information',
      fields: [
        {
          name: 'name',
          label: 'Product Name',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'sku',
          label: 'SKU',
          type: 'text',
          required: true,
          order: 2,
          validators: [{ type: 'pattern', value: '^[A-Z0-9-]+$', message: 'Invalid SKU format' }],
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
          order: 3,
          rows: 4,
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          order: 4,
          optionsUrl: '/api/categories',
        },
      ],
    },
    {
      name: 'pricing',
      title: 'Pricing & Inventory',
      fields: [
        {
          name: 'basePrice',
          label: 'Base Price',
          type: 'currency',
          required: true,
          order: 1,
          permissions: ['product.edit.pricing'],
        },
        {
          name: 'wholeSalePrice',
          label: 'Wholesale Price',
          type: 'currency',
          order: 2,
          permissions: ['product.edit.pricing'],
        },
        {
          name: 'inventory',
          label: 'Stock Quantity',
          type: 'number',
          required: true,
          order: 3,
          permissions: ['inventory.edit'],
        },
      ],
    },
    {
      name: 'visibility',
      title: 'Visibility & Status',
      fields: [
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          order: 1,
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
          permissions: ['product.publish'],
        },
        {
          name: 'visibility',
          label: 'Visibility',
          type: 'select',
          required: true,
          order: 2,
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Internal', value: 'internal' },
            { label: 'Private', value: 'private' },
          ],
          permissions: ['product.manage.visibility'],
        },
      ],
    },
  ],
  layout: 'single-column',
  submitLabel: 'Save Product',
  tenantId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};
