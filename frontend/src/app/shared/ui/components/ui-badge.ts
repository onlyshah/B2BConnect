import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ui-badge" [ngClass]="toneClass">
      <ng-content></ng-content>
    </span>
  `,
  styles: [
    `:host{display:inline-block}.ui-badge{display:inline-flex;align-items:center;gap:.5rem;padding:.28rem .6rem;border-radius:999px;font-weight:700;font-size:.82rem;text-transform:capitalize;border:1px solid transparent}
    .ui-badge.neutral{background:var(--surface-muted);color:var(--color-neutral);border-color:rgba(107,114,128,0.16)}
    .ui-badge.info{background:rgba(59,130,246,0.12);color:var(--color-info);border-color:rgba(59,130,246,0.18)}
    .ui-badge.success{background:rgba(34,176,125,0.14);color:var(--color-success);border-color:rgba(34,176,125,0.18)}
    .ui-badge.warning{background:rgba(255,176,32,0.16);color:#b46b00;border-color:rgba(255,176,32,0.22)}
    .ui-badge.danger{background:rgba(229,92,106,0.14);color:var(--color-danger);border-color:rgba(229,92,106,0.2)}
  `,
  ],
})
export class UiBadgeComponent {
  @Input() tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger' = 'neutral';

  @Input()
  set type(value: string | undefined) {
    this.tone = this.mapTone(value);
  }

  get toneClass(): string {
    return this.tone;
  }

  private mapTone(value?: string): 'neutral' | 'info' | 'success' | 'warning' | 'danger' {
    switch (value) {
      case 'approved':
      case 'success':
        return 'success';
      case 'pending':
      case 'warning':
      case 'attention':
        return 'warning';
      case 'info':
        return 'info';
      case 'danger':
        return 'danger';
      case 'primary':
      case 'secondary':
      case 'other':
      default:
        return 'neutral';
    }
  }
}
