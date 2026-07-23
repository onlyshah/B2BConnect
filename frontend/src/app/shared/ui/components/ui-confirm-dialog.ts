import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from './ui-button';

@Component({
  selector: 'ui-confirm-dialog',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    <div class="confirm-backdrop" *ngIf="open" (click)="cancel()">
      <div class="confirm-card" (click)="$event.stopPropagation()">
        <div class="confirm-icon" *ngIf="icon">{{ icon }}</div>
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="confirm-actions">
          <ui-button variant="secondary" (clicked)="cancel()">{{ cancelText }}</ui-button>
          <ui-button [variant]="confirmVariant" (clicked)="confirm()">{{ confirmText }}</ui-button>
        </div>
      </div>
    </div>
  `,
  styles: [
    ':host{display:block}',
    '.confirm-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:1rem;z-index:10000}',
    '.confirm-card{background:#fff;border-radius:1rem;padding:1.25rem;max-width:28rem;width:100%;box-shadow:0 20px 50px rgba(15,23,42,.2)}',
    '.confirm-icon{font-size:1.4rem;margin-bottom:.5rem}',
    'h3{margin:0 0 .35rem;font-size:1.1rem}',
    'p{margin:0 0 1rem;color:var(--text-muted,#64748b)}',
    '.confirm-actions{display:flex;justify-content:flex-end;gap:.75rem}'
  ]
})
export class UiConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirm action';
  @Input() message = 'Are you sure you want to continue?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() confirmVariant: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' = 'danger';
  @Input() icon?: string;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
