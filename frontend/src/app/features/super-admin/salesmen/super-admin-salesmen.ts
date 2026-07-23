import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-super-admin-salesmen',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Salesmen" eyebrow="field team" description="Keep an eye on the field team driving activity across territories.">
      <ng-container slot="actions">
        <ui-button>Invite</ui-button>
      </ng-container>

      <div class="page-grid">
        <ui-card title="Daniel Reed" subtitle="32 visits this week">
          <div class="module-list">
            <div class="module-row"><span>Route health</span><strong>Strong</strong></div>
          </div>
        </ui-card>
        <ui-card title="Shreya Patel" subtitle="28 visits this week">
          <div class="module-list">
            <div class="module-row"><span>Route health</span><strong>Stable</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: [`.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}.module-list{display:grid;gap:10px}.module-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}.module-row:last-child{border-bottom:0;padding-bottom:0}.module-row span{color:var(--text-muted)}@media(max-width:640px){.page-grid{grid-template-columns:1fr}}`] 
})
export class SuperAdminSalesmenComponent {}
