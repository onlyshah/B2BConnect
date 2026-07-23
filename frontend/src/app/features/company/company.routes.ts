import { Routes } from '@angular/router';
import { CompanyLayoutComponent } from './company-layout';
import { DashboardComponent } from '../dashboard/dashboard';
import { CompanyProfileComponent } from './profile/company-profile';
import { TerritoryManagementComponent } from './territory/territory-management';
import { ProductManagementComponent } from './products/product-management';
import { DistributorMarketplaceComponent } from './distributors/marketplace';
import { CampaignsComponent } from './campaigns/campaigns';
import { StoriesComponent } from './stories/stories';
import { SchemesComponent } from './schemes/schemes';

export const companyRoutes: Routes = [
  {
    path: '',
    component: CompanyLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard', subtitle: 'Monitor your entire distributor business in one view.', eyebrow: 'Company workspace' } },
      { path: 'profile', component: CompanyProfileComponent, data: { title: 'Profile', subtitle: 'Keep your company identity, contacts, and references current.', eyebrow: 'Company workspace' } },
      { path: 'territories', component: TerritoryManagementComponent, data: { title: 'Territories', subtitle: 'Plan and manage regional coverage, distribution zones, and routes.', eyebrow: 'Company workspace' } },
      { path: 'products', component: ProductManagementComponent, data: { title: 'Products', subtitle: 'Review product performance, launch status, and pricing readiness.', eyebrow: 'Company workspace' } },
      { path: 'distributors', component: DistributorMarketplaceComponent, data: { title: 'Distributors', subtitle: 'Track distributor onboarding, activity, and network consistency.', eyebrow: 'Company workspace' } },
      { path: 'campaigns', component: CampaignsComponent, data: { title: 'Campaigns', subtitle: 'Launch and coordinate field campaigns with clear owned outcomes.', eyebrow: 'Company workspace' } },
      { path: 'stories', component: StoriesComponent, data: { title: 'Stories', subtitle: 'Publish stories, promotions, and marketplace narratives.', eyebrow: 'Company workspace' } },
      { path: 'schemes', component: SchemesComponent, data: { title: 'Schemes', subtitle: 'Design and run incentive programs for distributors and retailers.', eyebrow: 'Company workspace' } },
      { path: 'analytics', redirectTo: '', pathMatch: 'full' }
    ]
  }
];
