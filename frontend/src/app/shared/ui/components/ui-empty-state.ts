import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state" [class]="toneClass">
      <div class="empty-state__copy">
        <h3 *ngIf="title">{{ title }}</h3>
        <p *ngIf="description">{{ description }}</p>
      </div>
      <div class="empty-state__actions" *ngIf="hasActions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `:host{display:block}.empty-state{padding:18px 20px;border:1px dashed var(--border);border-radius:18px;background:linear-gradient(135deg, var(--surface-muted), rgba(255,255,255,0.92));color:var(--text-muted);display:grid;gap:10px;box-shadow:var(--shadow-soft)}.empty-state__copy{display:grid;gap:6px}.empty-state h3{margin:0;color:var(--text);font-size:1rem}.empty-state p{margin:0;line-height:1.6}.empty-state.error{color:var(--color-danger);border-color:rgba(229,92,106,.24);background:rgba(229,92,106,.06)}.empty-state.success{color:var(--color-success);border-color:rgba(34,176,125,.22);background:rgba(34,176,125,.08)}.empty-state__actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:2px}`
  ]
})
export class UiEmptyStateComponent {
  @Input() title = '';
  @Input() description?: string;
  @Input() tone: 'neutral' | 'error' | 'success' = 'neutral';

  get toneClass(): string {
    return this.tone;
  }

  get hasActions(): boolean {
    return true;
  }
}
