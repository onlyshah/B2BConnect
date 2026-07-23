import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-super-admin-companies',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Companies" eyebrow="enterprise accounts" description="Monitor the companies that are active on the platform.">
      <ng-container slot="actions">
        <ui-button>Add company</ui-button>
      </ng-container>

      <div class="page-grid">
        <ui-card title="Northwind Foods" subtitle="Distributor network • Active">
          <div class="module-list">
            <div class="module-row"><span>Regions</span><strong>4 active regions</strong></div>
            <div class="module-row"><span>Health</span><strong>High growth</strong></div>
          </div>
        </ui-card>
        <ui-card title="BluePeak Retail" subtitle="Retail channel • Trial">
          <div class="module-list">
            <div class="module-row"><span>Stores</span><strong>2 pilot stores</strong></div>
            <div class="module-row"><span>Status</span><strong>Onboarding</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: [`.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}.module-list{display:grid;gap:10px}.module-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}.module-row:last-child{border-bottom:0;padding-bottom:0}.module-row span{color:var(--text-muted)}@media(max-width:640px){.page-grid{grid-template-columns:1fr}}`] 
})
export class SuperAdminCompaniesComponent {}
