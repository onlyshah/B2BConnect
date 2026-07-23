import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-super-admin-retailers',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Retailers" eyebrow="network" description="Track the retailer network across the platform.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Export</ui-button>
        <ui-button>+ Review</ui-button>
      </ng-container>

      <div class="page-grid">
        <ui-card title="City Market" subtitle="High volume partner">
          <div class="module-list">
            <div class="module-row"><span>Performance</span><strong>Strong growth</strong></div>
          </div>
        </ui-card>
        <ui-card title="North Star Stores" subtitle="Medium volume partner">
          <div class="module-list">
            <div class="module-row"><span>Performance</span><strong>Steady</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: [`.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.module-list{display:grid;gap:10px}.module-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}.module-row:last-child{border-bottom:0;padding-bottom:0}.module-row span{color:var(--text-muted)}`]
})
export class SuperAdminRetailersComponent {}
