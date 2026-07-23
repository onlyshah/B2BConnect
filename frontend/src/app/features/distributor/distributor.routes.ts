import { Routes } from '@angular/router';
import { DistributorLayoutComponent } from './distributor-layout';
import { DashboardComponent } from '../dashboard/dashboard';
import { DistributorRetailersComponent } from './retailers/distributor-retailers';
import { DistributorOrdersComponent } from './orders/distributor-orders';
import { DistributorInventoryComponent } from './inventory/distributor-inventory';
import { DistributorPricingComponent } from './pricing/distributor-pricing';
import { DistributorCollectionsComponent } from './collections/distributor-collections';
import { DistributorSamplesComponent } from './samples/distributor-samples';
import { DistributorAnalyticsComponent } from './analytics/distributor-analytics';
import { DistributorSettingsComponent } from './settings/distributor-settings';
import { DistributorModulePageComponent } from './module/distributor-module';
import { OrderCreateComponent } from '../orders/order-create/order-create';

export const distributorRoutes: Routes = [
  {
    path: '',
    component: DistributorLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard', subtitle: 'Keep a pulse on your distributor network and sales health.', eyebrow: 'Distributor workspace' } },
      { path: 'retailers', component: DistributorRetailersComponent, data: { title: 'Retailers', subtitle: 'Manage retailer relationships, coverage, and onboarding progress.', eyebrow: 'Distributor workspace' } },
      { path: 'orders/new', component: OrderCreateComponent, data: { title: 'New Order', subtitle: 'Create a new order with the right assortment and pricing.', eyebrow: 'Distributor workspace' } },
      { path: 'orders', component: DistributorOrdersComponent, data: { title: 'Orders', subtitle: 'Monitor orders from submission through fulfillment.', eyebrow: 'Distributor workspace' } },
      { path: 'inventory', component: DistributorInventoryComponent, data: { title: 'Inventory', subtitle: 'Track stock levels, movement, and replenishment readiness.', eyebrow: 'Distributor workspace' } },
      { path: 'pricing', component: DistributorPricingComponent, data: { title: 'Pricing', subtitle: 'Adjust pricing rules and customer-specific offers.', eyebrow: 'Distributor workspace' } },
      { path: 'schemes', component: DistributorModulePageComponent, data: { title: 'Schemes', subtitle: 'Create and manage company and distributor schemes.', eyebrow: 'Distributor workspace' } },
      { path: 'invoices', component: DistributorModulePageComponent, data: { title: 'Invoices', subtitle: 'Generate, share and track invoices for retailers.', eyebrow: 'Distributor workspace' } },
      { path: 'collections', component: DistributorCollectionsComponent, data: { title: 'Collections', subtitle: 'Keep receivables moving and recover outstanding dues.', eyebrow: 'Distributor workspace' } },
      { path: 'outstanding', component: DistributorModulePageComponent, data: { title: 'Outstanding', subtitle: 'Track dues, credit utilization and overdue balances.', eyebrow: 'Distributor workspace' } },
      { path: 'samples', component: DistributorSamplesComponent, data: { title: 'Samples', subtitle: 'Coordinate sample distribution and product trials.', eyebrow: 'Distributor workspace' } },
      { path: 'salesmen', component: DistributorModulePageComponent, data: { title: 'Salesmen', subtitle: 'Assign territories, monitor visits and manage salesman performance.', eyebrow: 'Distributor workspace' } },
      { path: 'stories', component: DistributorModulePageComponent, data: { title: 'Stories', subtitle: 'Share distributor stories, promotions and local updates.', eyebrow: 'Distributor workspace' } },
      { path: 'analytics', component: DistributorAnalyticsComponent, data: { title: 'Analytics', subtitle: 'Inspect performance trends and operational health.', eyebrow: 'Distributor workspace' } },
      { path: 'reports', component: DistributorModulePageComponent, data: { title: 'Reports', subtitle: 'Download sales, inventory and collection reports.', eyebrow: 'Distributor workspace' } },
      { path: 'notifications', component: DistributorModulePageComponent, data: { title: 'Notifications', subtitle: 'Keep your team aligned on orders, approvals and alerts.', eyebrow: 'Distributor workspace' } },
      { path: 'settings', component: DistributorSettingsComponent, data: { title: 'Settings', subtitle: 'Tune workspace preferences and configuration.', eyebrow: 'Distributor workspace' } },
      { path: 'profile', component: DistributorSettingsComponent, data: { title: 'Profile', subtitle: 'Review account settings and workspace preferences.', eyebrow: 'Distributor workspace' } }
    ]
  }
];
