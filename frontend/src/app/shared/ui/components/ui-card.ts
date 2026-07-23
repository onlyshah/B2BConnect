import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="ui-card" [class.elevated]="elevated">
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
  styles: [":host{display:block}.ui-card{background:linear-gradient(135deg,rgba(255,255,255,0.98),rgba(247,249,255,0.96));border:1px solid var(--border);border-radius:20px;padding:16px;box-shadow:var(--shadow-soft);transition:transform .2s ease,box-shadow .2s ease}.ui-card:hover{transform:translateY(-1px);box-shadow:0 16px 32px rgba(15,23,42,.08)}.ui-card.elevated{box-shadow:0 20px 44px rgba(15,23,42,.08)}.ui-card__header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid rgba(139,92,246,.12)}.ui-card__header h3{margin:0;font-size:1rem;color:var(--text)}.ui-card__header p{margin:4px 0 0;color:var(--text-muted);font-size:.9rem}.ui-card__body{display:grid;gap:12px}"]
})
export class UiCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() elevated = false;
}
