import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-profile',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Profile" eyebrow="field account" description="Review your sales profile, territory context, and performance outlook.">
      <ng-container slot="actions">
        <ui-button variant="secondary">View route</ui-button>
        <ui-button>Export summary</ui-button>
      </ng-container>

      <div class="module-shell">
        <ui-card title="Field profile" subtitle="Current sales profile snapshot">
          <div class="module-list">
            <div class="module-row"><span>Name</span><strong>{{ profile.name }}</strong></div>
            <div class="module-row"><span>Employee code</span><strong>{{ profile.employeeCode }}</strong></div>
            <div class="module-row"><span>Territory</span><strong>{{ profile.territory }}</strong></div>
            <div class="module-row"><span>Performance score</span><strong>{{ profile.performanceScore }}</strong></div>
          </div>
        </ui-card>

        <ui-card title="Weekly progress" subtitle="This week’s momentum">
          <div class="module-card">
            <div class="module-metrics">
              <span class="module-pill">📍 18 visits</span>
              <span class="module-pill">🧾 9 orders</span>
              <span class="module-pill">💬 5 follow-ups</span>
            </div>
            <div class="module-meter"><span style="width: 84%"></span></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class SalesmanProfileComponent {
  profile = {
    name: 'Amit Kumar',
    employeeCode: 'SM-101',
    territory: 'Mumbai West',
    performanceScore: '92/100'
  };
}
