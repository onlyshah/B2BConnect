import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-retailer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './retailer-layout.html',
  styleUrls: ['./retailer-layout.css']
})
export class RetailerLayoutComponent {
  navItems: NavItem[] = [
    { label: 'Home', route: '/retailer', icon: '🏠' },
    { label: 'Stories', route: '/retailer/stories', icon: '🎬' },
    { label: 'Products', route: '/retailer/products', icon: '🛍️' },
    { label: 'Orders', route: '/retailer/orders', icon: '📦' },
    { label: 'Offers', route: '/retailer/offers', icon: '🎁' },
    { label: 'Samples', route: '/retailer/samples', icon: '🧪' },
    { label: 'Demos', route: '/retailer/demos', icon: '🎤' },
    { label: 'Invoices', route: '/retailer/invoices', icon: '🧾' },
    { label: 'Payments', route: '/retailer/payments', icon: '💳' },
    { label: 'Rewards', route: '/retailer/rewards', icon: '⭐' },
    { label: 'Support', route: '/retailer/support', icon: '💬' },
    { label: 'Notifications', route: '/retailer/notifications', icon: '🔔' },
    { label: 'Settings', route: '/retailer/settings', icon: '⚙️' }
  ];

  mobileNavItems: NavItem[] = [
    { label: 'Home', route: '/retailer', icon: '🏠' },
    { label: 'Stories', route: '/retailer/stories', icon: '🎬' },
    { label: 'Products', route: '/retailer/products', icon: '🛍️' },
    { label: 'Orders', route: '/retailer/orders', icon: '📦' },
    { label: 'Profile', route: '/retailer/settings', icon: '👤' }
  ];
}
