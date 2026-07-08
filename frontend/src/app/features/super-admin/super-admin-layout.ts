import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent, DashboardNavGroup, DashboardNavItem } from '../../shared/ui/layouts/dashboard-layout';

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [RouterModule, DashboardLayoutComponent],
  templateUrl: './super-admin-layout.html',
  styleUrls: ['./super-admin-layout.css']
})
export class SuperAdminLayoutComponent {
  readonly appName = 'B2BConnect';
  readonly roleLabel = 'Platform Admin';
  readonly eyebrow = 'Platform administration';
  readonly title = 'Govern companies, subscriptions, approvals and support';
  readonly subtitle = 'Control onboarding, billing, governance, security, and platform analytics from one place.';
  readonly searchPlaceholder = 'Search companies, users, reports';
  readonly storageKey = 'super-admin-shell-collapsed';

  navGroups: DashboardNavGroup[] = [
    {
      title: 'Platform',
      items: [
        { label: 'Dashboard', route: '/super-admin', icon: '📊', exact: true },
        { label: 'Companies', route: '/super-admin/companies', icon: '🏢' },
        { label: 'Distributors', route: '/super-admin/distributors', icon: '🚚' },
        { label: 'Salesmen', route: '/super-admin/salesmen', icon: '🧑‍💼' },
        { label: 'Retailers', route: '/super-admin/retailers', icon: '🏪' }
      ]
    },
    {
      title: 'Governance',
      items: [
        { label: 'Approvals', route: '/super-admin/approvals', icon: '✅' },
        { label: 'Subscriptions', route: '/super-admin/subscriptions', icon: '💳' },
        { label: 'Billing', route: '/super-admin/billing', icon: '🧾' },
        { label: 'Roles', route: '/super-admin/roles', icon: '🛡️' },
        { label: 'Security', route: '/super-admin/security', icon: '🔐' },
        { label: 'Audit Logs', route: '/super-admin/audit-logs', icon: '🗄️' }
      ]
    },
    {
      title: 'Insights',
      items: [
        { label: 'Advertisements', route: '/super-admin/advertisements', icon: '📢' },
        { label: 'Stories', route: '/super-admin/stories', icon: '🎬' },
        { label: 'Support', route: '/super-admin/support', icon: '💬' },
        { label: 'Analytics', route: '/super-admin/analytics', icon: '📈' },
        { label: 'Reports', route: '/super-admin/reports', icon: '📄' },
        { label: 'Categories', route: '/super-admin/categories', icon: '🗂️' },
        { label: 'Territories', route: '/super-admin/territories', icon: '🌍' },
        { label: 'Data', route: '/super-admin/data-management', icon: '🗃️' },
        { label: 'Settings', route: '/super-admin/settings', icon: '⚙️' }
      ]
    }
  ];

  mobileNavItems: DashboardNavItem[] = [
    { label: 'Dashboard', route: '/super-admin', icon: '🏠', exact: true },
    { label: 'Approvals', route: '/super-admin/approvals', icon: '✅' },
    { label: 'Support', route: '/super-admin/support', icon: '💬' },
    { label: 'Analytics', route: '/super-admin/analytics', icon: '📈' },
    { label: 'Settings', route: '/super-admin/settings', icon: '⚙️' }
  ];
}
