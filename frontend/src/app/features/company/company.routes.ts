import { Routes } from '@angular/router';
import { CompanyLayoutComponent } from './company-layout';
import { CompanyDashboardComponent } from './dashboard/company-dashboard';
import { CompanyProfileComponent } from './profile/company-profile';
import { TerritoryManagementComponent } from './territory/territory-management';
import { ProductManagementComponent } from './products/product-management';
import { DistributorMarketplaceComponent } from './distributors/marketplace';
import { CampaignsComponent } from './campaigns/campaigns';
import { StoriesComponent } from './stories/stories';
import { SchemesComponent } from './schemes/schemes';
import { AnalyticsComponent } from './analytics/analytics';

export const companyRoutes: Routes = [
  {
    path: '',
    component: CompanyLayoutComponent,
    children: [
      { path: '', component: CompanyDashboardComponent },
      { path: 'profile', component: CompanyProfileComponent },
      { path: 'territories', component: TerritoryManagementComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'distributors', component: DistributorMarketplaceComponent },
      { path: 'campaigns', component: CampaignsComponent },
      { path: 'stories', component: StoriesComponent },
      { path: 'schemes', component: SchemesComponent },
      { path: 'analytics', component: AnalyticsComponent }
    ]
  }
];
