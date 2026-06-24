import { Routes } from '@angular/router';
import { SuperAdminLayoutComponent } from './super-admin-layout';
import { SuperAdminDashboardComponent } from './dashboard/super-admin-dashboard';
import { SuperAdminCompaniesComponent } from './companies/super-admin-companies';
import { SuperAdminDistributorsComponent } from './distributors/super-admin-distributors';
import { SuperAdminSalesmenComponent } from './salesmen/super-admin-salesmen';
import { SuperAdminRetailersComponent } from './retailers/super-admin-retailers';
import { SuperAdminApprovalsComponent } from './approvals/super-admin-approvals';
import { SuperAdminSubscriptionsComponent } from './subscriptions/super-admin-subscriptions';
import { SuperAdminBillingComponent } from './billing/super-admin-billing';
import { SuperAdminAdvertisementsComponent } from './advertisements/super-admin-advertisements';
import { SuperAdminStoriesComponent } from './stories/super-admin-stories';
import { SuperAdminSupportComponent } from './support/super-admin-support';
import { SuperAdminAnalyticsComponent } from './analytics/super-admin-analytics';
import { SuperAdminReportsComponent } from './reports/super-admin-reports';
import { SuperAdminRolesComponent } from './roles/super-admin-roles';
import { SuperAdminCategoriesComponent } from './categories/super-admin-categories';
import { SuperAdminTerritoriesComponent } from './territories/super-admin-territories';
import { SuperAdminSettingsComponent } from './settings/super-admin-settings';
import { SuperAdminAuditLogsComponent } from './audit-logs/super-admin-audit-logs';
import { SuperAdminSecurityComponent } from './security/super-admin-security';
import { SuperAdminDataManagementComponent } from './data-management/super-admin-data-management';

export const superAdminRoutes: Routes = [
  {
    path: '',
    component: SuperAdminLayoutComponent,
    children: [
      { path: '', component: SuperAdminDashboardComponent },
      { path: 'companies', component: SuperAdminCompaniesComponent },
      { path: 'distributors', component: SuperAdminDistributorsComponent },
      { path: 'salesmen', component: SuperAdminSalesmenComponent },
      { path: 'retailers', component: SuperAdminRetailersComponent },
      { path: 'approvals', component: SuperAdminApprovalsComponent },
      { path: 'subscriptions', component: SuperAdminSubscriptionsComponent },
      { path: 'billing', component: SuperAdminBillingComponent },
      { path: 'advertisements', component: SuperAdminAdvertisementsComponent },
      { path: 'stories', component: SuperAdminStoriesComponent },
      { path: 'support', component: SuperAdminSupportComponent },
      { path: 'analytics', component: SuperAdminAnalyticsComponent },
      { path: 'reports', component: SuperAdminReportsComponent },
      { path: 'roles', component: SuperAdminRolesComponent },
      { path: 'categories', component: SuperAdminCategoriesComponent },
      { path: 'territories', component: SuperAdminTerritoriesComponent },
      { path: 'settings', component: SuperAdminSettingsComponent },
      { path: 'audit-logs', component: SuperAdminAuditLogsComponent },
      { path: 'security', component: SuperAdminSecurityComponent },
      { path: 'data-management', component: SuperAdminDataManagementComponent }
    ]
  }
];
