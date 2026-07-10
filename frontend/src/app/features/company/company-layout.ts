import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent, DashboardNavGroup, DashboardNavItem } from '../../shared/ui/layouts/dashboard-layout';
import { UiButtonComponent } from '../../shared/ui/components/ui-button';

@Component({
  selector: 'app-company-layout',
  standalone: true,
  imports: [RouterModule, DashboardLayoutComponent, UiButtonComponent],
  templateUrl: './company-layout.html',
  styleUrls: ['./company-layout.css']
})
export class CompanyLayoutComponent {
  readonly appName = 'B2BConnect';
  readonly roleLabel = 'Company Admin';
  readonly eyebrow = 'Company workspace';
  readonly title = 'Operational summary for your network';
  readonly subtitle = 'Track distributor health, retailer approvals, stock pressure, and campaign readiness in one place.';
  readonly searchPlaceholder = 'Search distributors, products, campaigns';
  readonly storageKey = 'company-shell-collapsed';

  navGroups: DashboardNavGroup[] = [
    {
      title: 'Workspace',
      items: [
        { label: 'Dashboard', route: '/company', icon: '📊', exact: true },
        { label: 'Profile', route: '/company/profile', icon: '👤' },
        { label: 'Territories', route: '/company/territories', icon: '🗺️' },
        { label: 'Products', route: '/company/products', icon: '📦' }
      ]
    },
    {
      title: 'Growth',
      items: [
        { label: 'Distributors', route: '/company/distributors', icon: '🚚' },
        { label: 'Campaigns', route: '/company/campaigns', icon: '📢' },
        { label: 'Stories', route: '/company/stories', icon: '📝' },
        { label: 'Schemes', route: '/company/schemes', icon: '🎁' },
        { label: 'Analytics', route: '/company/analytics', icon: '📈' }
      ]
    }
  ];

  mobileNavItems: DashboardNavItem[] = [
    { label: 'Dashboard', route: '/company', icon: '🏠', exact: true },
    { label: 'Distributors', route: '/company/distributors', icon: '🚚' },
    { label: 'Products', route: '/company/products', icon: '📦' },
    { label: 'Analytics', route: '/company/analytics', icon: '📈' },
    { label: 'Profile', route: '/company/profile', icon: '👤' }
  ];
}
