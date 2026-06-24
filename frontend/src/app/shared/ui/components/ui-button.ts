import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="ui-button" [class]="variantClass" [type]="type" (click)="clicked.emit($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [":host{display:inline-block}.ui-button{border:0;border-radius:999px;padding:10px 14px;font-weight:600;cursor:pointer;background:var(--color-primary);color:#fff;display:inline-flex;align-items:center;justify-content:center;gap:8px}.ui-button.secondary{background:var(--color-secondary)}.ui-button.success{background:var(--color-success)}.ui-button.danger{background:var(--color-danger)}.ui-button.ghost{background:transparent;color:var(--text);border:1px solid var(--border)}"]
})
export class UiButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() clicked = new EventEmitter<Event>();

  get variantClass(): string {
    return this.variant;
  }
}
