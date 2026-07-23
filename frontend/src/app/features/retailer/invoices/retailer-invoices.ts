import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-invoices',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Invoices" eyebrow="billing" description="View invoice history and outstanding payment activity.">
      <div class="module-shell">
        <ui-card title="Invoice overview" subtitle="Current billing period">
          <div class="module-list">
            <div class="module-row"><span>Open invoices</span><strong>3</strong></div>
            <div class="module-row"><span>Paid this month</span><strong>₹24,000</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class RetailerInvoicesComponent {
  invoices = [
    { id: 'INV-001', amount: '₹4,200', status: 'Paid' },
    { id: 'INV-002', amount: '₹1,180', status: 'Pending' }
  ];
}
