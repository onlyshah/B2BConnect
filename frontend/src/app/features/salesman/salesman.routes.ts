import { Routes } from '@angular/router';
import { SalesmanLayoutComponent } from './salesman-layout';
import { SalesmanDashboardComponent } from './dashboard/salesman-dashboard';
import { SalesmanRouteComponent } from './route/salesman-route';
import { SalesmanRetailersComponent } from './retailers/salesman-retailers';
import { SalesmanOrdersComponent } from './orders/salesman-orders';
import { SalesmanVisitsComponent } from './visits/salesman-visits';
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

export const salesmanRoutes: Routes = [
  {
    path: '',
    component: SalesmanLayoutComponent,
    children: [
      { path: '', component: SalesmanDashboardComponent },
      { path: 'route', component: SalesmanRouteComponent },
      { path: 'retailers', component: SalesmanRetailersComponent },
      { path: 'orders', component: SalesmanOrdersComponent },
      { path: 'visits', component: SalesmanVisitsComponent },
      { path: 'followups', component: SalesmanFollowupsComponent },
      { path: 'samples', component: SalesmanSamplesComponent },
      { path: 'demos', component: SalesmanDemosComponent },
      { path: 'collections', component: SalesmanCollectionsComponent },
      { path: 'competitors', component: SalesmanCompetitorsComponent },
      { path: 'surveys', component: SalesmanSurveysComponent },
      { path: 'stories', component: SalesmanStoriesComponent },
      { path: 'training', component: SalesmanTrainingComponent },
      { path: 'reports', component: SalesmanReportsComponent },
      { path: 'notifications', component: SalesmanNotificationsComponent },
      { path: 'profile', component: SalesmanProfileComponent },
      { path: 'settings', component: SalesmanSettingsComponent }
    ]
  }
];
