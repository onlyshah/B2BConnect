import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="ui-form-field" [class.ui-form-field--stacked]="stacked">
      <span class="ui-form-field__label" *ngIf="label">{{ label }}</span>
      <ng-content></ng-content>
      <span class="ui-form-field__hint" *ngIf="hint">{{ hint }}</span>
    </label>
  `,
  styles: [":host{display:block}.ui-form-field{display:grid;gap:6px}.ui-form-field--stacked{gap:8px}.ui-form-field__label{font-size:.9rem;color:var(--text);font-weight:600}.ui-form-field__hint{font-size:.8rem;color:var(--text-muted)}"]
})
export class UiFormFieldComponent {
  @Input() label = '';
  @Input() hint = '';
  @Input() stacked = true;
}
