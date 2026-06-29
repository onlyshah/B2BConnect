import { Routes } from '@angular/router';
import { RetailerLayoutComponent } from './retailer-layout';
import { RetailerDashboardComponent } from './dashboard/retailer-dashboard';
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
      { path: '', component: RetailerDashboardComponent },
      { path: 'stories', component: RetailerStoriesComponent },
      { path: 'products', component: RetailerProductsComponent },
      { path: 'orders/new', component: OrderCreateComponent },
      { path: 'orders', component: RetailerOrdersComponent },
      { path: 'offers', component: RetailerOffersComponent },
      { path: 'samples', component: RetailerSamplesComponent },
      { path: 'demos', component: RetailerDemosComponent },
      { path: 'invoices', component: RetailerInvoicesComponent },
      { path: 'payments', component: RetailerPaymentsComponent },
      { path: 'rewards', component: RetailerRewardsComponent },
      { path: 'support', component: RetailerSupportComponent },
      { path: 'notifications', component: RetailerNotificationsComponent },
      { path: 'settings', component: RetailerSettingsComponent }
    ]
  }
];
