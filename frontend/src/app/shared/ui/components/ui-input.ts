import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label class="ui-input">
      <span *ngIf="label">{{ label }}</span>
      <input [type]="type" [placeholder]="placeholder" [value]="value" (input)="value = $any($event.target).value; changed.emit(value)" />
    </label>
  `,
  styles: [":host{display:block}.ui-input{display:grid;gap:6px}.ui-input span{font-size:.9rem;color:var(--text-muted)}.ui-input input{border:1px solid var(--border);border-radius:12px;padding:10px 12px;background:var(--surface-elevated);color:var(--text)}"]
})
export class UiInputComponent {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() value = '';
  @Output() changed = new EventEmitter<string>();
}
