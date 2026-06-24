import { Routes } from '@angular/router';
import { RoleSelectionComponent } from './components/role-selection.component';
import { CompanyRegistrationComponent } from './components/company-registration.component';
import { DistributorRegistrationComponent } from './components/distributor-registration.component';
import { SalesmanRegistrationComponent } from './components/salesman-registration.component';
import { RetailerRegistrationComponent } from './components/retailer-registration.component';

export const registrationRoutes: Routes = [
  {
    path: '',
    component: RoleSelectionComponent
  },
  {
    path: 'company',
    component: CompanyRegistrationComponent
  },
  {
    path: 'distributor',
    component: DistributorRegistrationComponent
  },
  {
    path: 'salesman',
    component: SalesmanRegistrationComponent
  },
  {
    path: 'retailer',
    component: RetailerRegistrationComponent
  }
];
