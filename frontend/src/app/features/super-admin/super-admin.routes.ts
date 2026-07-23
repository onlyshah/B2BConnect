import { Routes } from '@angular/router';
import { SuperAdminLayoutComponent } from './super-admin-layout';
import { DashboardComponent } from '../dashboard/dashboard';
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
      { path: '', component: DashboardComponent, data: { title: 'Dashboard', subtitle: 'Govern platform health, growth, and operations from one view.', eyebrow: 'Platform administration' } },
      { path: 'companies', component: SuperAdminCompaniesComponent, data: { title: 'Companies', subtitle: 'Review tenant onboarding, health, and platform relationships.', eyebrow: 'Platform administration' } },
      { path: 'distributors', component: SuperAdminDistributorsComponent, data: { title: 'Distributors', subtitle: 'Monitor distributor performance and operational compliance.', eyebrow: 'Platform administration' } },
      { path: 'salesmen', component: SuperAdminSalesmenComponent, data: { title: 'Salesmen', subtitle: 'Review field team coverage and management structure.', eyebrow: 'Platform administration' } },
      { path: 'retailers', component: SuperAdminRetailersComponent, data: { title: 'Retailers', subtitle: 'Track retailer accounts and program participation.', eyebrow: 'Platform administration' } },
      { path: 'approvals', component: SuperAdminApprovalsComponent, data: { title: 'Approvals', subtitle: 'Review pending governance and onboarding decisions.', eyebrow: 'Platform administration' } },
      { path: 'subscriptions', component: SuperAdminSubscriptionsComponent, data: { title: 'Subscriptions', subtitle: 'Manage billing plans, entitlements, and renewals.', eyebrow: 'Platform administration' } },
      { path: 'billing', component: SuperAdminBillingComponent, data: { title: 'Billing', subtitle: 'Inspect invoices, payments, and commercial operations.', eyebrow: 'Platform administration' } },
      { path: 'advertisements', component: SuperAdminAdvertisementsComponent, data: { title: 'Advertisements', subtitle: 'Create and manage platform campaigns and media.', eyebrow: 'Platform administration' } },
      { path: 'stories', component: SuperAdminStoriesComponent, data: { title: 'Stories', subtitle: 'Publish and review cross-tenant stories and content.', eyebrow: 'Platform administration' } },
      { path: 'support', component: SuperAdminSupportComponent, data: { title: 'Support', subtitle: 'Coordinate customer support and issue resolution.', eyebrow: 'Platform administration' } },
      { path: 'analytics', component: SuperAdminAnalyticsComponent, data: { title: 'Analytics', subtitle: 'Inspect platform trends, adoption, and performance.', eyebrow: 'Platform administration' } },
      { path: 'reports', component: SuperAdminReportsComponent, data: { title: 'Reports', subtitle: 'Distribute operational and executive reporting.', eyebrow: 'Platform administration' } },
      { path: 'roles', component: SuperAdminRolesComponent, data: { title: 'Roles', subtitle: 'Define access patterns and role structures.', eyebrow: 'Platform administration' } },
      { path: 'categories', component: SuperAdminCategoriesComponent, data: { title: 'Categories', subtitle: 'Manage product and content categories.', eyebrow: 'Platform administration' } },
      { path: 'territories', component: SuperAdminTerritoriesComponent, data: { title: 'Territories', subtitle: 'Maintain global coverage zones and boundaries.', eyebrow: 'Platform administration' } },
      { path: 'settings', component: SuperAdminSettingsComponent, data: { title: 'Settings', subtitle: 'Control platform configuration and preferences.', eyebrow: 'Platform administration' } },
      { path: 'audit-logs', component: SuperAdminAuditLogsComponent, data: { title: 'Audit Logs', subtitle: 'Review change history and compliance audit trails.', eyebrow: 'Platform administration' } },
      { path: 'security', component: SuperAdminSecurityComponent, data: { title: 'Security', subtitle: 'Monitor security posture and governance controls.', eyebrow: 'Platform administration' } },
      { path: 'data-management', component: SuperAdminDataManagementComponent, data: { title: 'Data Management', subtitle: 'Maintain data quality and sync operations.', eyebrow: 'Platform administration' } }
    ]
  }
];
