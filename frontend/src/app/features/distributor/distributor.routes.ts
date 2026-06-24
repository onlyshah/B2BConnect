import { Routes } from '@angular/router';
import { DistributorLayoutComponent } from './distributor-layout';
import { DistributorDashboardComponent } from './dashboard/distributor-dashboard';
import { DistributorRetailersComponent } from './retailers/distributor-retailers';
import { DistributorOrdersComponent } from './orders/distributor-orders';
import { DistributorInventoryComponent } from './inventory/distributor-inventory';
import { DistributorPricingComponent } from './pricing/distributor-pricing';
import { DistributorCollectionsComponent } from './collections/distributor-collections';
import { DistributorSamplesComponent } from './samples/distributor-samples';
import { DistributorAnalyticsComponent } from './analytics/distributor-analytics';
import { DistributorSettingsComponent } from './settings/distributor-settings';
import { DistributorModulePageComponent } from './module/distributor-module';

export const distributorRoutes: Routes = [
  {
    path: '',
    component: DistributorLayoutComponent,
    children: [
      { path: '', component: DistributorDashboardComponent },
      { path: 'retailers', component: DistributorRetailersComponent },
      { path: 'orders', component: DistributorOrdersComponent },
      { path: 'inventory', component: DistributorInventoryComponent },
      { path: 'pricing', component: DistributorPricingComponent },
      { path: 'schemes', component: DistributorModulePageComponent, data: { title: 'Schemes', description: 'Create and manage company and distributor schemes.', icon: '🎁' } },
      { path: 'invoices', component: DistributorModulePageComponent, data: { title: 'Invoices', description: 'Generate, share and track invoices for retailers.', icon: '🧾' } },
      { path: 'collections', component: DistributorCollectionsComponent },
      { path: 'outstanding', component: DistributorModulePageComponent, data: { title: 'Outstanding', description: 'Track dues, credit utilization and overdue balances.', icon: '💰' } },
      { path: 'samples', component: DistributorSamplesComponent },
      { path: 'salesmen', component: DistributorModulePageComponent, data: { title: 'Salesmen', description: 'Assign territories, monitor visits and manage salesman performance.', icon: '🧑‍💼' } },
      { path: 'stories', component: DistributorModulePageComponent, data: { title: 'Stories', description: 'Share distributor stories, promotions and local updates.', icon: '📝' } },
      { path: 'analytics', component: DistributorAnalyticsComponent },
      { path: 'reports', component: DistributorModulePageComponent, data: { title: 'Reports', description: 'Download sales, inventory and collection reports.', icon: '📈' } },
      { path: 'notifications', component: DistributorModulePageComponent, data: { title: 'Notifications', description: 'Keep your team aligned on orders, approvals and alerts.', icon: '🔔' } },
      { path: 'settings', component: DistributorSettingsComponent },
      { path: 'profile', component: DistributorSettingsComponent }
    ]
  }
];
