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
  styles: [":host{display:block}.bottom-tabs{display:none;position:sticky;bottom:0;left:0;right:0;z-index:20;background:rgba(255,255,255,0.96);backdrop-filter:blur(12px);border-top:1px solid #e8ebf5;padding:8px 8px max(12px, env(safe-area-inset-bottom));justify-content:space-around}.bottom-tabs a{display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:#64708a;font-size:0.78rem}.bottom-tabs a.active{color:#8b5cf6;font-weight:700}.bottom-tabs a span{font-size:1.05rem}@media (max-width: 767px){.bottom-tabs{display:flex}}"]
})
export class UiBottomTabsComponent {
  @Input() items: Array<{ label: string; route: string; icon: string }> = [];
}
