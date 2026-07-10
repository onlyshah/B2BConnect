import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent, DashboardNavGroup, DashboardNavItem } from '../../shared/ui/layouts/dashboard-layout';
import { UiButtonComponent } from '../../shared/ui/components/ui-button';

@Component({
  selector: 'app-salesman-layout',
  standalone: true,
  imports: [RouterModule, DashboardLayoutComponent, UiButtonComponent],
  templateUrl: './salesman-layout.html',
  styleUrls: ['./salesman-layout.css']
})
export class SalesmanLayoutComponent {
  readonly appName = 'B2BConnect';
  readonly roleLabel = 'Sales Executive';
  readonly eyebrow = 'Sales execution workspace';
  readonly title = 'Visit, order, follow up and report';
  readonly subtitle = 'Track daily beats, capture visits, and keep retailer relationships moving.';
  readonly searchPlaceholder = 'Search retailers, visits, orders';
  readonly storageKey = 'salesman-shell-collapsed';

  navGroups: DashboardNavGroup[] = [
    {
      title: 'Daily',
      items: [
        { label: 'Dashboard', route: '/salesman', icon: '📈', exact: true },
        { label: 'Today Route', route: '/salesman/route', icon: '🗺️' },
        { label: 'Retailers', route: '/salesman/retailers', icon: '🏪' },
        { label: 'Orders', route: '/salesman/orders', icon: '🛒' },
        { label: 'Visits', route: '/salesman/visits', icon: '📍' },
        { label: 'Follow-ups', route: '/salesman/followups', icon: '🔁' }
      ]
    },
    {
      title: 'Field Tools',
      items: [
        { label: 'Samples', route: '/salesman/samples', icon: '🧪' },
        { label: 'Demos', route: '/salesman/demos', icon: '🎤' },
        { label: 'Collections', route: '/salesman/collections', icon: '💰' },
        { label: 'Reports', route: '/salesman/reports', icon: '📄' },
        { label: 'Stories', route: '/salesman/stories', icon: '🎬' },
        { label: 'Training', route: '/salesman/training', icon: '🎓' }
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Profile', route: '/salesman/profile', icon: '👤' }
      ]
    }
  ];

  mobileNavItems: DashboardNavItem[] = [
    { label: 'Home', route: '/salesman', icon: '🏠', exact: true },
    { label: 'Retailers', route: '/salesman/retailers', icon: '🏪' },
    { label: 'Orders', route: '/salesman/orders', icon: '🛒' },
    { label: 'Visits', route: '/salesman/visits', icon: '📍' },
    { label: 'Profile', route: '/salesman/profile', icon: '👤' }
  ];
}
