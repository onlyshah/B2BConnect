import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-list-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-toolbar">
      <div class="list-toolbar__heading">
        <h2 *ngIf="title">{{ title }}</h2>
        <p *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="list-toolbar__actions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `:host{display:block}.list-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:4px 0 2px}.list-toolbar__heading{display:grid;gap:2px}.list-toolbar__heading h2{margin:0;font-size:1rem;color:var(--text)}.list-toolbar__heading p{margin:0;color:var(--text-muted);font-size:.9rem}.list-toolbar__actions{display:flex;gap:8px;flex-wrap:wrap}@media (max-width: 640px){.list-toolbar{flex-direction:column;align-items:flex-start}}`
  ]
})
export class UiListToolbarComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
