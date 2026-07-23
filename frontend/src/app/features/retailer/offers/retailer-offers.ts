import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-offers',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Offers" eyebrow="promotions" description="Review active offers and promotional incentives for your store.">
      <div class="module-shell">
        <ui-card title="Active offers" subtitle="This month">
          <div class="module-list">
            <div class="module-row"><span>Festival discount</span><strong>15% off</strong></div>
            <div class="module-row"><span>Bulk offer</span><strong>Buy 2 get 1</strong></div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class RetailerOffersComponent {
  offers = [
    { title: 'Festival Pack', detail: 'Flat 10% off on bulk orders', valid: 'Till July 31' },
    { title: 'Loyalty Reward', detail: 'Extra points on every order', valid: 'Ongoing' }
  ];
}
