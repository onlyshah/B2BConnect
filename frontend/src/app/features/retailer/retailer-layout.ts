import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent, DashboardNavGroup, DashboardNavItem } from '../../shared/ui/layouts/dashboard-layout';
import { UiButtonComponent } from '../../shared/ui/components/ui-button';

@Component({
  selector: 'app-retailer-layout',
  standalone: true,
  imports: [RouterModule, DashboardLayoutComponent, UiButtonComponent],
  templateUrl: './retailer-layout.html',
  styleUrls: ['./retailer-layout.css']
})
export class RetailerLayoutComponent {
  readonly appName = 'B2BConnect';
  readonly roleLabel = 'Retailer';
  readonly eyebrow = 'Retailer workspace';
  readonly title = 'Shopping and ordering, simplified';
  readonly subtitle = 'Discover products, create orders, manage offers, and keep payments on track.';
  readonly searchPlaceholder = 'Search products, orders, invoices';
  readonly storageKey = 'retailer-shell-collapsed';

  navGroups: DashboardNavGroup[] = [
    {
      title: 'Discover',
      items: [
        { label: 'Home', route: '/retailer', icon: '🏠', exact: true },
        { label: 'Stories', route: '/retailer/stories', icon: '🎬' },
        { label: 'Products', route: '/retailer/products', icon: '🛍️' }
      ]
    },
    {
      title: 'Commerce',
      items: [
        { label: 'Orders', route: '/retailer/orders', icon: '📦' },
        { label: 'Offers', route: '/retailer/offers', icon: '🎁' },
        { label: 'Samples', route: '/retailer/samples', icon: '🧪' },
        { label: 'Demos', route: '/retailer/demos', icon: '🎤' }
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Invoices', route: '/retailer/invoices', icon: '🧾' },
        { label: 'Payments', route: '/retailer/payments', icon: '💳' },
        { label: 'Rewards', route: '/retailer/rewards', icon: '⭐' },
        { label: 'Support', route: '/retailer/support', icon: '💬' },
        { label: 'Notifications', route: '/retailer/notifications', icon: '🔔' },
        { label: 'Settings', route: '/retailer/settings', icon: '⚙️' }
      ]
    }
  ];

  mobileNavItems: DashboardNavItem[] = [
    { label: 'Home', route: '/retailer', icon: '🏠', exact: true },
    { label: 'Products', route: '/retailer/products', icon: '🛍️' },
    { label: 'Orders', route: '/retailer/orders', icon: '📦' },
    { label: 'Payments', route: '/retailer/payments', icon: '💳' },
    { label: 'Profile', route: '/retailer/settings', icon: '👤' }
  ];
}
