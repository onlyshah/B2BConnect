import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ui-badge" [ngClass]="type">
      <ng-content></ng-content>
    </span>
  `,
  styles: [
    `:host{display:inline-block}.ui-badge{display:inline-flex;align-items:center;gap:.5rem;padding:.28rem .6rem;border-radius:999px;font-weight:700;font-size:.82rem;text-transform:capitalize;border:1px solid transparent}
    .ui-badge.pending{background:linear-gradient(90deg,#fff7ed,#fff1d6);color:#92400e;border-color:rgba(245,158,11,0.12)}
    .ui-badge.approved{background:linear-gradient(90deg,#f5f3ff,#efeaff);color:#4c1d95;border-color:rgba(124,58,237,0.12)}
    .ui-badge.other{background:linear-gradient(90deg,#f3f4f6,#eef2ff);color:#374151;border-color:rgba(99,102,241,0.06)}
    .ui-badge.info{background:linear-gradient(90deg,#eff6ff,#e0f2fe);color:#0b5cff;border-color:rgba(59,130,246,0.08)}
    .ui-badge.primary{background:linear-gradient(90deg,#eff6ff,#dbeafe);color:#1d4ed8;border-color:rgba(59,130,246,0.18)}
    .ui-badge.secondary{background:linear-gradient(90deg,#f8fafc,#e2e8f0);color:#334155;border-color:rgba(148,163,184,0.18)}
    .ui-badge.success{background:linear-gradient(90deg,#ecfdf5,#dcfce7);color:#166534;border-color:rgba(52,211,153,0.18)}
    .ui-badge.warning{background:linear-gradient(90deg,#fffbeb,#fef3c7);color:#92400e;border-color:rgba(245,158,11,0.18)}
    .ui-badge.danger{background:linear-gradient(90deg,#fef2f2,#fee2e2);color:#991b1b;border-color:rgba(239,68,68,0.18)}
  `,
  ],
})
export class UiBadgeComponent {
  @Input() type: 'pending' | 'approved' | 'other' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'other';
}
