import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent, DashboardNavGroup, DashboardNavItem } from '../../shared/ui/layouts/dashboard-layout';

@Component({
  selector: 'app-distributor-layout',
  standalone: true,
  imports: [RouterModule, DashboardLayoutComponent],
  templateUrl: './distributor-layout.html',
  styleUrls: ['./distributor-layout.css']
})
export class DistributorLayoutComponent {
  readonly appName = 'B2BConnect';
  readonly roleLabel = 'Distributor Admin';
  readonly eyebrow = 'Distributor workspace';
  readonly title = 'Portfolio overview for your network';
  readonly subtitle = 'Manage orders, inventory, retailers, collections, and pricing from one command center.';
  readonly searchPlaceholder = 'Search orders, retailers, invoices';
  readonly storageKey = 'distributor-shell-collapsed';

  navGroups: DashboardNavGroup[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', route: '/distributor', icon: '📈', exact: true },
        { label: 'Retailers', route: '/distributor/retailers', icon: '🏪', permission: 'view-retailers' },
        { label: 'Orders', route: '/distributor/orders', icon: '📦', permission: 'view-orders' },
        { label: 'Inventory', route: '/distributor/inventory', icon: '📚', permission: 'view-inventory' }
      ]
    },
    {
      title: 'Operations',
      items: [
        { label: 'Pricing', route: '/distributor/pricing', icon: '💲', permission: 'manage-pricing' },
        { label: 'Schemes', route: '/distributor/schemes', icon: '🎁', permission: 'manage-schemes' },
        { label: 'Collections', route: '/distributor/collections', icon: '💳', permission: 'manage-collections' },
        { label: 'Samples', route: '/distributor/samples', icon: '🧪', permission: 'manage-samples' },
        { label: 'Salesmen', route: '/distributor/salesmen', icon: '🧑‍💼', permission: 'manage-salesmen' }
      ]
    },
    {
      title: 'Insights',
      items: [
        { label: 'Analytics', route: '/distributor/analytics', icon: '📊', permission: 'view-analytics' },
        { label: 'Settings', route: '/distributor/settings', icon: '⚙️', permission: 'manage-settings' }
      ]
    }
  ];

  mobileNavItems: DashboardNavItem[] = [
    { label: 'Dashboard', route: '/distributor', icon: '🏠', exact: true },
    { label: 'Orders', route: '/distributor/orders', icon: '📦' },
    { label: 'Retailers', route: '/distributor/retailers', icon: '🏪' },
    { label: 'Inventory', route: '/distributor/inventory', icon: '📚' },
    { label: 'Settings', route: '/distributor/settings', icon: '⚙️' }
  ];
}
