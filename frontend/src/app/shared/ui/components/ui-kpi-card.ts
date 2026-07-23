import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="ui-kpi-card">
      <p class="ui-kpi-card__label">{{ label }}</p>
      <h3 class="ui-kpi-card__value">{{ value }}</h3>
      <p class="ui-kpi-card__hint" *ngIf="hint">{{ hint }}</p>
    </article>
  `,
  styles: [":host{display:block}.ui-kpi-card{display:grid;gap:8px;background:var(--surface-elevated);border:1px solid var(--border);border-radius:18px;padding:16px;box-shadow:var(--shadow)}.ui-kpi-card__label{margin:0;font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted)}.ui-kpi-card__value{margin:0;font-size:1.35rem;color:var(--text)}.ui-kpi-card__hint{margin:0;color:var(--text-muted);font-size:.88rem}"]
})
export class UiKpiCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() hint = '';
}
