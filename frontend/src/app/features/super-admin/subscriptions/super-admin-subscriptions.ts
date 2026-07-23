import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-super-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Subscriptions" eyebrow="plans & renewals" description="Keep your billing footprint aligned with current growth.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Upgrade</ui-button>
      </ng-container>

      <div class="page-grid">
        <ui-card title="Enterprise plan" subtitle="Renews in 12 days">
          <div class="module-list">
            <div class="module-row"><span>Value</span><strong>Priority support</strong></div>
          </div>
        </ui-card>
        <ui-card title="Growth plan" subtitle="Renews in 3 days">
          <div class="module-list">
            <div class="module-row"><span>Value</span><strong>Expansion ready</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: [`.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}.module-list{display:grid;gap:10px}.module-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}.module-row:last-child{border-bottom:0;padding-bottom:0}.module-row span{color:var(--text-muted)}@media(max-width:640px){.page-grid{grid-template-columns:1fr}}`] 
})
export class SuperAdminSubscriptionsComponent {}
