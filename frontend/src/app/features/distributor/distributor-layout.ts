import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  permission?: string;
}

@Component({
  selector: 'app-distributor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './distributor-layout.html',
  styleUrls: ['./distributor-layout.css']
})
export class DistributorLayoutComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/distributor', icon: '📊' },
    { label: 'Retailers', route: '/distributor/retailers', icon: '🏪', permission: 'view-retailers' },
    { label: 'Orders', route: '/distributor/orders', icon: '📦', permission: 'view-orders' },
    { label: 'Inventory', route: '/distributor/inventory', icon: '📦', permission: 'view-inventory' },
    { label: 'Pricing', route: '/distributor/pricing', icon: '💲', permission: 'manage-pricing' },
    { label: 'Schemes', route: '/distributor/schemes', icon: '🎁', permission: 'manage-schemes' },
    { label: 'Collections', route: '/distributor/collections', icon: '💳', permission: 'manage-collections' },
    { label: 'Samples', route: '/distributor/samples', icon: '🧪', permission: 'manage-samples' },
    { label: 'Salesmen', route: '/distributor/salesmen', icon: '🧑‍💼', permission: 'manage-salesmen' },
    { label: 'Analytics', route: '/distributor/analytics', icon: '📈', permission: 'view-analytics' },
    { label: 'Settings', route: '/distributor/settings', icon: '⚙️', permission: 'manage-settings' }
  ];

  mobileNavItems: NavItem[] = [
    { label: 'Home', route: '/distributor', icon: '🏠' },
    { label: 'Orders', route: '/distributor/orders', icon: '📦' },
    { label: 'Retailers', route: '/distributor/retailers', icon: '🏪' },
    { label: 'Inventory', route: '/distributor/inventory', icon: '📦' },
    { label: 'Settings', route: '/distributor/settings', icon: '⚙️' }
  ];

  constructor(private authService: AuthService) {}

  canShow(item: NavItem): boolean {
    if (!item.permission) return true;
    return this.authService.hasPermission(item.permission);
  }
}
