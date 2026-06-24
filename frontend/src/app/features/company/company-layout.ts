import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CompanyNavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-company-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-layout.html',
  styleUrls: ['./company-layout.css']
})
export class CompanyLayoutComponent {
  navItems: CompanyNavItem[] = [
    { label: 'Dashboard', route: '/company', icon: '📊' },
    { label: 'Profile', route: '/company/profile', icon: '👤' },
    { label: 'Territories', route: '/company/territories', icon: '🗺️' },
    { label: 'Products', route: '/company/products', icon: '📦' },
    { label: 'Distributors', route: '/company/distributors', icon: '🚚' },
    { label: 'Campaigns', route: '/company/campaigns', icon: '📢' },
    { label: 'Stories', route: '/company/stories', icon: '📝' },
    { label: 'Schemes', route: '/company/schemes', icon: '🎁' },
    { label: 'Analytics', route: '/company/analytics', icon: '📈' }
  ];
}
