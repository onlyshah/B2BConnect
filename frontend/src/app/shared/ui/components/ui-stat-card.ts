import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="stat-card">
      <p class="stat-label">{{ label }}</p>
      <div class="stat-value-row">
        <strong>{{ value }}</strong>
        <span *ngIf="trend" [class]="trendClass">{{ trend }}</span>
      </div>
    </article>
  `,
  styles: [":host{display:block}.stat-card{background:var(--surface-elevated);border:1px solid var(--border);border-radius:16px;padding:14px;min-height:112px}.stat-label{margin:0 0 8px;color:var(--text-muted);font-size:.85rem;text-transform:uppercase;letter-spacing:.08em}.stat-value-row{display:flex;justify-content:space-between;align-items:end;gap:8px}.stat-value-row strong{font-size:1.35rem;color:var(--text)}.stat-value-row span{font-size:.85rem;font-weight:600}.positive{color:var(--color-success)}.negative{color:var(--color-danger)}.neutral{color:var(--color-neutral)}"]
})
export class UiStatCardComponent {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() trend?: string;
  @Input() trendType: 'positive' | 'negative' | 'neutral' = 'neutral';

  get trendClass(): string {
    return this.trendType;
  }
}
