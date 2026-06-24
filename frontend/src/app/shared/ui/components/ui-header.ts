import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="page-header">
      <div>
        <p class="eyebrow" *ngIf="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
      </div>
      <div class="actions">
        <ng-content></ng-content>
      </div>
    </header>
  `,
  styles: [":host{display:block}.page-header{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px 0 12px}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;color:var(--text-muted);margin:0 0 4px}.page-header h1{margin:0;font-size:1.25rem}.actions{display:flex;gap:8px;flex-wrap:wrap}"]
})
export class UiHeaderComponent {
  @Input() title = '';
  @Input() eyebrow?: string;
  @Output() action = new EventEmitter<void>();
}
