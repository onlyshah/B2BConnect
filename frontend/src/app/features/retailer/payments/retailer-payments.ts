import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-payments',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Payments" eyebrow="finance" description="Keep an eye on completed and pending payments for your account.">
      <div class="module-shell">
        <ui-card title="Payment summary" subtitle="Current month">
          <div class="module-list">
            <div class="module-row"><span>Cleared</span><strong>₹18,000</strong></div>
            <div class="module-row"><span>Pending</span><strong>₹4,500</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class RetailerPaymentsComponent {
  payments = [
    { title: 'Outstanding Amount', value: '₹12,400' },
    { title: 'Upcoming Due', value: '₹3,200' },
    { title: 'Credit Balance', value: '₹8,000' }
  ];
}
