import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-notifications',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Notifications" eyebrow="updates" description="Review account and order updates relevant to your retail operations.">
      <div class="module-shell">
        <ui-card title="Latest alerts" subtitle="Recent updates">
          <div class="module-list">
            <div class="module-row"><span>Order approved</span><strong>1</strong></div>
            <div class="module-row"><span>Payment reminder</span><strong>1</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class RetailerNotificationsComponent {
  items = [
    { title: 'New Offer', body: 'Festival pricing is live' },
    { title: 'Order Update', body: 'Your order is packed and ready' }
  ];
}
