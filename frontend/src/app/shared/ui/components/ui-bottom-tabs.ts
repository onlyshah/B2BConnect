import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ui-bottom-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bottom-tabs">
      <a *ngFor="let item of items" [routerLink]="item.route" routerLinkActive="active">
        <span>{{ item.icon }}</span>
        <small>{{ item.label }}</small>
      </a>
    </nav>
  `,
  styles: [":host{display:block}.bottom-tabs{display:none;position:sticky;bottom:0;background:var(--surface-elevated);border-top:1px solid var(--border);padding:8px 8px 12px;justify-content:space-around}.bottom-tabs a{display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:var(--text-muted)}.bottom-tabs a.active{color:var(--color-primary)}@media (max-width: 767px){.bottom-tabs{display:flex}}"]
})
export class UiBottomTabsComponent {
  @Input() items: Array<{ label: string; route: string; icon: string }> = [];
}
