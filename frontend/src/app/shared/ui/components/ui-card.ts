import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="ui-card" [ngClass]="className" [class.elevated]="elevated">
      <div class="ui-card__header" *ngIf="title || subtitle">
        <div>
          <h3 *ngIf="title">{{ title }}</h3>
          <p *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <ng-content select="[slot=actions]"></ng-content>
      </div>
      <div class="ui-card__body">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [":host{display:block}.ui-card{background:var(--surface-elevated);border:1px solid var(--border);border-radius:18px;padding:16px;box-shadow:var(--shadow)}.ui-card.elevated{box-shadow:0 18px 40px rgba(15,23,42,.08)}.ui-card__header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}.ui-card__header h3{margin:0;font-size:1rem}.ui-card__header p{margin:4px 0 0;color:var(--text-muted);font-size:.9rem}.ui-card__body{display:grid;gap:12px}"]
})
export class UiCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() elevated = false;
  @Input('class') className = '';
}
