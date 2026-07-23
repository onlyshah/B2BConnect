import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-super-admin-distributors',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Distributors" eyebrow="supply chain" description="Track the distributor base that supports your companies.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Manage</ui-button>
      </ng-container>

      <div class="page-grid">
        <ui-card title="Harbor Distribution" subtitle="14 active routes">
          <div class="module-list">
            <div class="module-row"><span>Coverage</span><strong>North region</strong></div>
            <div class="module-row"><span>Status</span><strong>Healthy</strong></div>
          </div>
        </ui-card>
        <ui-card title="Metro Wholesale" subtitle="9 active routes">
          <div class="module-list">
            <div class="module-row"><span>Coverage</span><strong>Central region</strong></div>
            <div class="module-row"><span>Status</span><strong>Steady</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: [`.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}.module-list{display:grid;gap:10px}.module-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}.module-row:last-child{border-bottom:0;padding-bottom:0}.module-row span{color:var(--text-muted)}@media(max-width:640px){.page-grid{grid-template-columns:1fr}}`] 
})
export class SuperAdminDistributorsComponent {}
