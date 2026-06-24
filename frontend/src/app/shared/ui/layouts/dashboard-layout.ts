import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiHeaderComponent } from '../components/ui-header';
import { UiSidebarComponent } from '../components/ui-sidebar';
import { UiBottomTabsComponent } from '../components/ui-bottom-tabs';

@Component({
  selector: 'dashboard-layout',
  standalone: true,
  imports: [CommonModule, UiHeaderComponent, UiSidebarComponent, UiBottomTabsComponent],
  template: `
    <div class="dashboard-shell">
      <ui-sidebar class="desktop-sidebar" [title]="title" [items]="navItems"></ui-sidebar>
      <div class="dashboard-main">
        <ui-header [title]="title" [eyebrow]="eyebrow">
          <ng-content select="[slot=header-actions]"></ng-content>
        </ui-header>
        <div class="dashboard-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
    <ui-bottom-tabs [items]="mobileNavItems"></ui-bottom-tabs>
  `,
  styles: [":host{display:block}.dashboard-shell{display:grid;grid-template-columns:260px minmax(0,1fr);gap:16px;min-height:100vh}.desktop-sidebar{display:block}.dashboard-main{display:flex;flex-direction:column;min-width:0}.dashboard-content{display:grid;gap:16px;padding-bottom:24px}.dashboard-content ::ng-deep > *{display:block}@media (max-width: 767px){.dashboard-shell{grid-template-columns:1fr}.desktop-sidebar{display:none}}"]
})
export class DashboardLayoutComponent {
  @Input() title = 'Workspace';
  @Input() eyebrow = 'Operations';
  @Input() navItems: Array<{ label: string; route: string; icon: string }> = [];
  @Input() mobileNavItems: Array<{ label: string; route: string; icon: string }> = [];
}
