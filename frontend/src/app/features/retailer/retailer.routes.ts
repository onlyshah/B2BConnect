import { Routes } from '@angular/router';
import { RetailerLayoutComponent } from './retailer-layout';
import { DashboardComponent } from '../dashboard/dashboard';
import { RetailerStoriesComponent } from './stories/retailer-stories';
import { RetailerProductsComponent } from './products/retailer-products';
import { RetailerOrdersComponent } from './orders/retailer-orders';
import { RetailerOffersComponent } from './offers/retailer-offers';
import { RetailerSamplesComponent } from './samples/retailer-samples';
import { RetailerDemosComponent } from './demos/retailer-demos';
import { RetailerInvoicesComponent } from './invoices/retailer-invoices';
import { RetailerPaymentsComponent } from './payments/retailer-payments';
import { RetailerRewardsComponent } from './rewards/retailer-rewards';
import { RetailerSupportComponent } from './support/retailer-support';
import { RetailerNotificationsComponent } from './notifications/retailer-notifications';
import { RetailerSettingsComponent } from './settings/retailer-settings';
import { OrderCreateComponent } from '../orders/order-create/order-create';

export const retailerRoutes: Routes = [
  {
    path: '',
    component: RetailerLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Home', subtitle: 'Discover products, offers, and your latest portfolio context.', eyebrow: 'Retailer workspace' } },
      { path: 'stories', component: RetailerStoriesComponent, data: { title: 'Stories', subtitle: 'View brand stories, campaigns, and fresh product highlights.', eyebrow: 'Retailer workspace' } },
      { path: 'products', component: RetailerProductsComponent, data: { title: 'Products', subtitle: 'Browse products, availability, and buying options.', eyebrow: 'Retailer workspace' } },
      { path: 'orders/new', component: OrderCreateComponent, data: { title: 'New Order', subtitle: 'Create a shopper-friendly order in minutes.', eyebrow: 'Retailer workspace' } },
      { path: 'orders', component: RetailerOrdersComponent, data: { title: 'Orders', subtitle: 'Track order status and fulfillment from one place.', eyebrow: 'Retailer workspace' } },
      { path: 'offers', component: RetailerOffersComponent, data: { title: 'Offers', subtitle: 'Review current incentives, schemes, and promotional pricing.', eyebrow: 'Retailer workspace' } },
      { path: 'samples', component: RetailerSamplesComponent, data: { title: 'Samples', subtitle: 'Request samples and manage trial deliveries.', eyebrow: 'Retailer workspace' } },
      { path: 'demos', component: RetailerDemosComponent, data: { title: 'Demos', subtitle: 'Book product demos and keep your team informed.', eyebrow: 'Retailer workspace' } },
      { path: 'invoices', component: RetailerInvoicesComponent, data: { title: 'Invoices', subtitle: 'Review invoices and payment references.', eyebrow: 'Retailer workspace' } },
      { path: 'payments', component: RetailerPaymentsComponent, data: { title: 'Payments', subtitle: 'Keep payments, dues, and status updates organized.', eyebrow: 'Retailer workspace' } },
      { path: 'rewards', component: RetailerRewardsComponent, data: { title: 'Rewards', subtitle: 'Monitor loyalty credits and reward progress.', eyebrow: 'Retailer workspace' } },
      { path: 'support', component: RetailerSupportComponent, data: { title: 'Support', subtitle: 'Raise concerns, requests, and help needs quickly.', eyebrow: 'Retailer workspace' } },
      { path: 'notifications', component: RetailerNotificationsComponent, data: { title: 'Notifications', subtitle: 'Stay updated on approvals, offers, and account activity.', eyebrow: 'Retailer workspace' } },
      { path: 'settings', component: RetailerSettingsComponent, data: { title: 'Settings', subtitle: 'Manage profile, account preferences, and contact details.', eyebrow: 'Retailer workspace' } }
    ]
  }
];
