import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-salesman-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './salesman-layout.html',
  styleUrls: ['./salesman-layout.css']
})
export class SalesmanLayoutComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/salesman', icon: '📊' },
    { label: 'Today Route', route: '/salesman/route', icon: '🗺️' },
    { label: 'Retailers', route: '/salesman/retailers', icon: '🏪' },
    { label: 'Orders', route: '/salesman/orders', icon: '🛒' },
    { label: 'Visits', route: '/salesman/visits', icon: '📍' },
    { label: 'Follow-ups', route: '/salesman/followups', icon: '🔁' },
    { label: 'Samples', route: '/salesman/samples', icon: '🧪' },
    { label: 'Demos', route: '/salesman/demos', icon: '🎤' },
    { label: 'Collections', route: '/salesman/collections', icon: '💰' },
    { label: 'Reports', route: '/salesman/reports', icon: '📄' },
    { label: 'Stories', route: '/salesman/stories', icon: '🎬' },
    { label: 'Training', route: '/salesman/training', icon: '🎓' },
    { label: 'Profile', route: '/salesman/profile', icon: '👤' }
  ];

  mobileNavItems: NavItem[] = [
    { label: 'Home', route: '/salesman', icon: '🏠' },
    { label: 'Retailers', route: '/salesman/retailers', icon: '🏪' },
    { label: 'Orders', route: '/salesman/orders', icon: '🛒' },
    { label: 'Visits', route: '/salesman/visits', icon: '📍' },
    { label: 'Profile', route: '/salesman/profile', icon: '👤' }
  ];
}
