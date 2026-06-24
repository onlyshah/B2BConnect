import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="brand">{{ title }}</div>
      <nav>
        <a *ngFor="let item of items" [routerLink]="item.route" routerLinkActive="active">
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [":host{display:block}.sidebar{background:linear-gradient(180deg,var(--color-primary),var(--color-primary-strong));color:#fff;padding:16px;border-radius:20px;min-height:100%}.brand{font-size:1.05rem;font-weight:700;padding:6px 6px 14px;border-bottom:1px solid rgba(255,255,255,.2);margin-bottom:10px}.sidebar nav{display:grid;gap:6px}.sidebar a{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:12px;color:rgba(255,255,255,.92);text-decoration:none}.sidebar a.active{background:rgba(255,255,255,.16)}"]
})
export class UiSidebarComponent {
  @Input() title = 'B2BConnect';
  @Input() items: Array<{ label: string; route: string; icon: string }> = [];
}
