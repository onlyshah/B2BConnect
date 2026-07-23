import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-super-admin-approvals',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Approvals" eyebrow="governance" description="Review the platform requests that need action.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Review all</ui-button>
      </ng-container>

      <div class="page-grid">
        <ui-card title="Distributor onboarding" subtitle="Pending • 2 hours ago">
          <div class="module-list">
            <div class="module-row"><span>Partner</span><strong>Northwind logistics</strong></div>
            <div class="module-row"><span>Reason</span><strong>New partner request</strong></div>
          </div>
        </ui-card>
        <ui-card title="Retailer verification" subtitle="Pending • 45 mins ago">
          <div class="module-list">
            <div class="module-row"><span>Partner</span><strong>City Mart</strong></div>
            <div class="module-row"><span>Reason</span><strong>Business proof review</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: [`.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}.module-list{display:grid;gap:10px}.module-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}.module-row:last-child{border-bottom:0;padding-bottom:0}.module-row span{color:var(--text-muted)}@media(max-width:640px){.page-grid{grid-template-columns:1fr}}`] 
})
export class SuperAdminApprovalsComponent {}
