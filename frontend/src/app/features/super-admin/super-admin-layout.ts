import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './super-admin-layout.html',
  styleUrls: ['./super-admin-layout.css']
})
export class SuperAdminLayoutComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/super-admin', icon: '📊' },
    { label: 'Companies', route: '/super-admin/companies', icon: '🏢' },
    { label: 'Distributors', route: '/super-admin/distributors', icon: '🚚' },
    { label: 'Salesmen', route: '/super-admin/salesmen', icon: '🧑‍💼' },
    { label: 'Retailers', route: '/super-admin/retailers', icon: '🏪' },
    { label: 'Approvals', route: '/super-admin/approvals', icon: '✅' },
    { label: 'Subscriptions', route: '/super-admin/subscriptions', icon: '💳' },
    { label: 'Billing', route: '/super-admin/billing', icon: '🧾' },
    { label: 'Advertisements', route: '/super-admin/advertisements', icon: '📢' },
    { label: 'Stories', route: '/super-admin/stories', icon: '🎬' },
    { label: 'Support', route: '/super-admin/support', icon: '💬' },
    { label: 'Analytics', route: '/super-admin/analytics', icon: '📈' },
    { label: 'Reports', route: '/super-admin/reports', icon: '📄' },
    { label: 'Roles', route: '/super-admin/roles', icon: '🛡️' },
    { label: 'Categories', route: '/super-admin/categories', icon: '🗂️' },
    { label: 'Territories', route: '/super-admin/territories', icon: '🌍' },
    { label: 'Settings', route: '/super-admin/settings', icon: '⚙️' },
    { label: 'Audit Logs', route: '/super-admin/audit-logs', icon: '🧾' },
    { label: 'Security', route: '/super-admin/security', icon: '🔐' },
    { label: 'Data', route: '/super-admin/data-management', icon: '🗄️' }
  ];

  mobileNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/super-admin', icon: '🏠' },
    { label: 'Approvals', route: '/super-admin/approvals', icon: '✅' },
    { label: 'Support', route: '/super-admin/support', icon: '💬' },
    { label: 'Analytics', route: '/super-admin/analytics', icon: '📈' },
    { label: 'Settings', route: '/super-admin/settings', icon: '⚙️' }
  ];
}
