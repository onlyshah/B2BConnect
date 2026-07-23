import { Routes } from '@angular/router';
import { SalesmanLayoutComponent } from './salesman-layout';
import { DashboardComponent } from '../dashboard/dashboard';
import { SalesmanRouteComponent } from './route/salesman-route';
import { SalesmanRetailersComponent } from './retailers/salesman-retailers';
import { SalesmanOrdersComponent } from './orders/salesman-orders';
import { SalesmanVisitsComponent } from './visits/salesman-visits';
import { VisitEntryComponent } from './visits/visit-entry/visit-entry';
import { SalesmanFollowupsComponent } from './followups/salesman-followups';
import { SalesmanSamplesComponent } from './samples/salesman-samples';
import { SalesmanDemosComponent } from './demos/salesman-demos';
import { SalesmanCollectionsComponent } from './collections/salesman-collections';
import { SalesmanCompetitorsComponent } from './competitors/salesman-competitors';
import { SalesmanSurveysComponent } from './surveys/salesman-surveys';
import { SalesmanStoriesComponent } from './stories/salesman-stories';
import { SalesmanTrainingComponent } from './training/salesman-training';
import { SalesmanReportsComponent } from './reports/salesman-reports';
import { SalesmanNotificationsComponent } from './notifications/salesman-notifications';
import { SalesmanProfileComponent } from './profile/salesman-profile';
import { SalesmanSettingsComponent } from './settings/salesman-settings';
import { OrderCreateComponent } from '../orders/order-create/order-create';

export const salesmanRoutes: Routes = [
  {
    path: '',
    component: SalesmanLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard', subtitle: 'Stay on top of your day, visits, and sales follow-up.', eyebrow: 'Sales execution workspace' } },
      { path: 'route', component: SalesmanRouteComponent, data: { title: 'Today Route', subtitle: 'Plan your beat, retailers, and next actions.', eyebrow: 'Sales execution workspace' } },
      { path: 'retailers', component: SalesmanRetailersComponent, data: { title: 'Retailers', subtitle: 'Manage your route and customer relationship progress.', eyebrow: 'Sales execution workspace' } },
      { path: 'orders/new', component: OrderCreateComponent, data: { title: 'New Order', subtitle: 'Capture orders quickly while you are on the move.', eyebrow: 'Sales execution workspace' } },
      { path: 'orders', component: SalesmanOrdersComponent, data: { title: 'Orders', subtitle: 'Review submitted orders and latest handoffs.', eyebrow: 'Sales execution workspace' } },
      { path: 'visits/new', component: VisitEntryComponent, data: { title: 'New Visit', subtitle: 'Log a retailer visit with notes and next steps.', eyebrow: 'Sales execution workspace' } },
      { path: 'visits', component: SalesmanVisitsComponent, data: { title: 'Visits', subtitle: 'Review your visit history and follow-up cadence.', eyebrow: 'Sales execution workspace' } },
      { path: 'followups', component: SalesmanFollowupsComponent, data: { title: 'Follow-ups', subtitle: 'Keep promises and next actions visible.', eyebrow: 'Sales execution workspace' } },
      { path: 'samples', component: SalesmanSamplesComponent, data: { title: 'Samples', subtitle: 'Distribute samples and track trial activity.', eyebrow: 'Sales execution workspace' } },
      { path: 'demos', component: SalesmanDemosComponent, data: { title: 'Demos', subtitle: 'Coordinate product demonstrations and outcomes.', eyebrow: 'Sales execution workspace' } },
      { path: 'collections', component: SalesmanCollectionsComponent, data: { title: 'Collections', subtitle: 'Record collections and move payment progress forward.', eyebrow: 'Sales execution workspace' } },
      { path: 'competitors', component: SalesmanCompetitorsComponent, data: { title: 'Competitors', subtitle: 'Capture market observations and competitor notes.', eyebrow: 'Sales execution workspace' } },
      { path: 'surveys', component: SalesmanSurveysComponent, data: { title: 'Surveys', subtitle: 'Collect field feedback and customer responses.', eyebrow: 'Sales execution workspace' } },
      { path: 'stories', component: SalesmanStoriesComponent, data: { title: 'Stories', subtitle: 'Share field stories and local market updates.', eyebrow: 'Sales execution workspace' } },
      { path: 'training', component: SalesmanTrainingComponent, data: { title: 'Training', subtitle: 'Keep product and process training up to date.', eyebrow: 'Sales execution workspace' } },
      { path: 'reports', component: SalesmanReportsComponent, data: { title: 'Reports', subtitle: 'Submit insights, outcomes, and route summaries.', eyebrow: 'Sales execution workspace' } },
      { path: 'notifications', component: SalesmanNotificationsComponent, data: { title: 'Notifications', subtitle: 'Stay aligned on approvals, alerts, and tasks.', eyebrow: 'Sales execution workspace' } },
      { path: 'profile', component: SalesmanProfileComponent, data: { title: 'Profile', subtitle: 'Review your account details and field setup.', eyebrow: 'Sales execution workspace' } },
      { path: 'settings', component: SalesmanSettingsComponent, data: { title: 'Settings', subtitle: 'Adjust preferences and account configuration.', eyebrow: 'Sales execution workspace' } }
    ]
  }
];
