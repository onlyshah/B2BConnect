import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-settings',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Settings" eyebrow="account" description="Manage your account profile, contact preferences, and business details in one place.">
      <ng-container slot="actions">
        <ui-button variant="secondary">Edit profile</ui-button>
        <ui-button>Save defaults</ui-button>
      </ng-container>

      <div class="module-shell">
        <ui-card title="Store profile" subtitle="Your current retailer details">
          <div class="module-list">
            <div class="module-row"><span>Store name</span><strong>{{ profile.storeName }}</strong></div>
            <div class="module-row"><span>Owner</span><strong>{{ profile.ownerName }}</strong></div>
            <div class="module-row"><span>Phone</span><strong>{{ profile.mobile }}</strong></div>
            <div class="module-row"><span>City</span><strong>{{ profile.city }}</strong></div>
          </div>
        </ui-card>

        <ui-card title="Preferences" subtitle="Workspace defaults and notifications">
          <div class="module-grid">
            <div class="module-card">
              <h3>Alerts</h3>
              <p>Receive updates for orders, offers, and delivery milestones.</p>
            </div>
            <div class="module-card">
              <h3>Reminder cadence</h3>
              <p>Daily review of pending orders and priority collections.</p>
            </div>
            <div class="module-card">
              <h3>Contact sync</h3>
              <p>Keep your distributor contact details up to date automatically.</p>
            </div>
          </div>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class RetailerSettingsComponent {
  profile = {
    storeName: 'Arrvi Retail',
    ownerName: 'Ravi Sharma',
    mobile: '+91-9876543210',
    city: 'Mumbai'
  };
}
