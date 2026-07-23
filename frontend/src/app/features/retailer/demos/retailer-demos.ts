import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-demos',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Demos" eyebrow="engagement" description="Track product demos and the interest generated from your retail audience.">
      <div class="module-shell">
        <ui-card title="Demo schedule" subtitle="Upcoming and recent demos">
          <div class="module-list">
            <div class="module-row"><span>Upcoming</span><strong>2</strong></div>
            <div class="module-row"><span>Completed</span><strong>5</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class RetailerDemosComponent {
  requests = [
    { title: 'Product Demo', status: 'Scheduled' },
    { title: 'Store Visit', status: 'Requested' }
  ];
}
