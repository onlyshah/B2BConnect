import { Injectable } from '@angular/core';
import { DashboardNavGroup, DashboardNavItem } from '../shared/ui/layouts/dashboard-layout';
import { WORKSPACE_ROUTE_LINKS } from '../core/constants/workspace-routes';

export type WorkspaceRole = 'company-admin' | 'distributor-admin' | 'retailer' | 'salesman' | 'super-admin';

export interface WorkspaceShellConfig {
  appName: string;
  roleLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  storageKey: string;
  navGroups: DashboardNavGroup[];
  mobileNavItems: DashboardNavItem[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkspaceShellConfigService {
  getConfig(role: WorkspaceRole): WorkspaceShellConfig {
    switch (role) {
      case 'company-admin':
        return {
          appName: 'B2BConnect',
          roleLabel: 'Company Admin',
          eyebrow: 'Company workspace',
          title: 'Manage your entire FMCG network',
          subtitle: 'Track distributor health, retailer, stock, and campaign in one place.',
          searchPlaceholder: 'Search distributors, products, campaigns',
          storageKey: 'company-shell-collapsed',
          navGroups: [
            {
              title: 'Workspace',
              items: [
                { label: 'Dashboard', route: WORKSPACE_ROUTE_LINKS.companyRoot, icon: '📊', exact: true },
                { label: 'Profile', route: WORKSPACE_ROUTE_LINKS.companyProfile, icon: '👤' },
                { label: 'Territories', route: WORKSPACE_ROUTE_LINKS.companyTerritories, icon: '🗺️' },
                { label: 'Products', route: WORKSPACE_ROUTE_LINKS.companyProducts, icon: '📦' }
              ]
            },
            {
              title: 'Growth',
              items: [
                { label: 'Distributors', route: WORKSPACE_ROUTE_LINKS.companyDistributors, icon: '🚚' },
                { label: 'Campaigns', route: WORKSPACE_ROUTE_LINKS.companyCampaigns, icon: '📢' },
                { label: 'Stories', route: WORKSPACE_ROUTE_LINKS.companyStories, icon: '📝' },
                { label: 'Schemes', route: WORKSPACE_ROUTE_LINKS.companySchemes, icon: '🎁' },
                { label: 'Analytics', route: WORKSPACE_ROUTE_LINKS.companyAnalytics, icon: '📈' }
              ]
            }
          ],
          mobileNavItems: [
            { label: 'Dashboard', route: WORKSPACE_ROUTE_LINKS.companyRoot, icon: '🏠', exact: true },
            { label: 'Distributors', route: WORKSPACE_ROUTE_LINKS.companyDistributors, icon: '🚚' },
            { label: 'Products', route: WORKSPACE_ROUTE_LINKS.companyProducts, icon: '📦' },
            { label: 'Analytics', route: WORKSPACE_ROUTE_LINKS.companyAnalytics, icon: '📈' },
            { label: 'Profile', route: WORKSPACE_ROUTE_LINKS.companyProfile, icon: '👤' }
          ]
        };
      case 'distributor-admin':
        return {
          appName: 'B2BConnect',
          roleLabel: 'Distributor Admin',
          eyebrow: 'Distributor workspace',
          title: 'Portfolio overview for your network',
          subtitle: 'Manage orders, inventory, retailers, collections, and pricing from one command center.',
          searchPlaceholder: 'Search orders, retailers, invoices',
          storageKey: 'distributor-shell-collapsed',
          navGroups: [
            {
              title: 'Overview',
              items: [
                { label: 'Dashboard', route: WORKSPACE_ROUTE_LINKS.distributorRoot, icon: '📈', exact: true },
                { label: 'Retailers', route: WORKSPACE_ROUTE_LINKS.distributorRetailers, icon: '🏪', permission: 'view-retailers' },
                { label: 'Orders', route: WORKSPACE_ROUTE_LINKS.distributorOrders, icon: '📦', permission: 'view-orders' },
                { label: 'Inventory', route: WORKSPACE_ROUTE_LINKS.distributorInventory, icon: '📚', permission: 'view-inventory' }
              ]
            },
            {
              title: 'Operations',
              items: [
                { label: 'Pricing', route: WORKSPACE_ROUTE_LINKS.distributorPricing, icon: '💲', permission: 'manage-pricing' },
                { label: 'Schemes', route: WORKSPACE_ROUTE_LINKS.distributorSchemes, icon: '🎁', permission: 'manage-schemes' },
                { label: 'Collections', route: WORKSPACE_ROUTE_LINKS.distributorCollections, icon: '💳', permission: 'manage-collections' },
                { label: 'Samples', route: WORKSPACE_ROUTE_LINKS.distributorSamples, icon: '🧪', permission: 'manage-samples' },
                { label: 'Salesmen', route: WORKSPACE_ROUTE_LINKS.distributorSalesmen, icon: '🧑‍💼', permission: 'manage-salesmen' }
              ]
            },
            {
              title: 'Insights',
              items: [
                { label: 'Analytics', route: WORKSPACE_ROUTE_LINKS.distributorAnalytics, icon: '📊', permission: 'view-analytics' },
                { label: 'Settings', route: WORKSPACE_ROUTE_LINKS.distributorSettings, icon: '⚙️', permission: 'manage-settings' }
              ]
            }
          ],
          mobileNavItems: [
            { label: 'Dashboard', route: WORKSPACE_ROUTE_LINKS.distributorRoot, icon: '🏠', exact: true },
            { label: 'Orders', route: WORKSPACE_ROUTE_LINKS.distributorOrders, icon: '📦' },
            { label: 'Retailers', route: WORKSPACE_ROUTE_LINKS.distributorRetailers, icon: '🏪' },
            { label: 'Inventory', route: WORKSPACE_ROUTE_LINKS.distributorInventory, icon: '📚' },
            { label: 'Settings', route: WORKSPACE_ROUTE_LINKS.distributorSettings, icon: '⚙️' }
          ]
        };
      case 'retailer':
        return {
          appName: 'B2BConnect',
          roleLabel: 'Retailer',
          eyebrow: 'Retailer workspace',
          title: 'Shopping and ordering, simplified',
          subtitle: 'Discover products, create orders, manage offers, and keep payments on track.',
          searchPlaceholder: 'Search products, orders, invoices',
          storageKey: 'retailer-shell-collapsed',
          navGroups: [
            {
              title: 'Discover',
              items: [
                { label: 'Home', route: WORKSPACE_ROUTE_LINKS.retailerRoot, icon: '🏠', exact: true },
                { label: 'Stories', route: WORKSPACE_ROUTE_LINKS.retailerStories, icon: '🎬' },
                { label: 'Products', route: WORKSPACE_ROUTE_LINKS.retailerProducts, icon: '🛍️' }
              ]
            },
            {
              title: 'Commerce',
              items: [
                { label: 'Orders', route: WORKSPACE_ROUTE_LINKS.retailerOrders, icon: '📦' },
                { label: 'Offers', route: WORKSPACE_ROUTE_LINKS.retailerOffers, icon: '🎁' },
                { label: 'Samples', route: WORKSPACE_ROUTE_LINKS.retailerSamples, icon: '🧪' },
                { label: 'Demos', route: WORKSPACE_ROUTE_LINKS.retailerDemos, icon: '🎤' }
              ]
            },
            {
              title: 'Account',
              items: [
                { label: 'Invoices', route: WORKSPACE_ROUTE_LINKS.retailerInvoices, icon: '🧾' },
                { label: 'Payments', route: WORKSPACE_ROUTE_LINKS.retailerPayments, icon: '💳' },
                { label: 'Rewards', route: WORKSPACE_ROUTE_LINKS.retailerRewards, icon: '⭐' },
                { label: 'Support', route: WORKSPACE_ROUTE_LINKS.retailerSupport, icon: '💬' },
                { label: 'Notifications', route: WORKSPACE_ROUTE_LINKS.retailerNotifications, icon: '🔔' },
                { label: 'Settings', route: WORKSPACE_ROUTE_LINKS.retailerSettings, icon: '⚙️' }
              ]
            }
          ],
          mobileNavItems: [
            { label: 'Home', route: WORKSPACE_ROUTE_LINKS.retailerRoot, icon: '🏠', exact: true },
            { label: 'Products', route: WORKSPACE_ROUTE_LINKS.retailerProducts, icon: '🛍️' },
            { label: 'Orders', route: WORKSPACE_ROUTE_LINKS.retailerOrders, icon: '📦' },
            { label: 'Payments', route: WORKSPACE_ROUTE_LINKS.retailerPayments, icon: '💳' },
            { label: 'Profile', route: WORKSPACE_ROUTE_LINKS.retailerSettings, icon: '👤' }
          ]
        };
      case 'salesman':
        return {
          appName: 'B2BConnect',
          roleLabel: 'Sales Executive',
          eyebrow: 'Sales execution workspace',
          title: 'Visit, order, follow up and report',
          subtitle: 'Track daily beats, capture visits, and keep retailer relationships moving.',
          searchPlaceholder: 'Search retailers, visits, orders',
          storageKey: 'salesman-shell-collapsed',
          navGroups: [
            {
              title: 'Daily',
              items: [
                { label: 'Dashboard', route: WORKSPACE_ROUTE_LINKS.salesmanRoot, icon: '📈', exact: true },
                { label: 'Today Route', route: WORKSPACE_ROUTE_LINKS.salesmanRoute, icon: '🗺️' },
                { label: 'Retailers', route: WORKSPACE_ROUTE_LINKS.salesmanRetailers, icon: '🏪' },
                { label: 'Orders', route: WORKSPACE_ROUTE_LINKS.salesmanOrders, icon: '🛒' },
                { label: 'Visits', route: WORKSPACE_ROUTE_LINKS.salesmanVisits, icon: '📍' },
                { label: 'Follow-ups', route: WORKSPACE_ROUTE_LINKS.salesmanFollowups, icon: '🔁' }
              ]
            },
            {
              title: 'Field Tools',
              items: [
                { label: 'Samples', route: WORKSPACE_ROUTE_LINKS.salesmanSamples, icon: '🧪' },
                { label: 'Demos', route: WORKSPACE_ROUTE_LINKS.salesmanDemos, icon: '🎤' },
                { label: 'Collections', route: WORKSPACE_ROUTE_LINKS.salesmanCollections, icon: '💰' },
                { label: 'Reports', route: WORKSPACE_ROUTE_LINKS.salesmanReports, icon: '📄' },
                { label: 'Stories', route: WORKSPACE_ROUTE_LINKS.salesmanStories, icon: '🎬' },
                { label: 'Training', route: WORKSPACE_ROUTE_LINKS.salesmanTraining, icon: '🎓' }
              ]
            },
            {
              title: 'Account',
              items: [
                { label: 'Profile', route: WORKSPACE_ROUTE_LINKS.salesmanProfile, icon: '👤' }
              ]
            }
          ],
          mobileNavItems: [
            { label: 'Home', route: WORKSPACE_ROUTE_LINKS.salesmanRoot, icon: '🏠', exact: true },
            { label: 'Retailers', route: WORKSPACE_ROUTE_LINKS.salesmanRetailers, icon: '🏪' },
            { label: 'Orders', route: WORKSPACE_ROUTE_LINKS.salesmanOrders, icon: '🛒' },
            { label: 'Visits', route: WORKSPACE_ROUTE_LINKS.salesmanVisits, icon: '📍' },
            { label: 'Profile', route: WORKSPACE_ROUTE_LINKS.salesmanProfile, icon: '👤' }
          ]
        };
      case 'super-admin':
        return {
          appName: 'B2BConnect',
          roleLabel: 'Platform Admin',
          eyebrow: 'Platform administration',
          title: 'Govern companies, subscriptions, approvals and support',
          subtitle: 'Control onboarding, billing, governance, security, and platform analytics from one place.',
          searchPlaceholder: 'Search companies, users, reports',
          storageKey: 'super-admin-shell-collapsed',
          navGroups: [
            {
              title: 'Platform',
              items: [
                { label: 'Dashboard', route: WORKSPACE_ROUTE_LINKS.superAdminRoot, icon: '📊', exact: true },
                { label: 'Companies', route: WORKSPACE_ROUTE_LINKS.superAdminCompanies, icon: '🏢' },
                { label: 'Distributors', route: WORKSPACE_ROUTE_LINKS.superAdminDistributors, icon: '🚚' },
                { label: 'Salesmen', route: WORKSPACE_ROUTE_LINKS.superAdminSalesmen, icon: '🧑‍💼' },
                { label: 'Retailers', route: WORKSPACE_ROUTE_LINKS.superAdminRetailers, icon: '🏪' }
              ]
            },
            {
              title: 'Governance',
              items: [
                { label: 'Approvals', route: WORKSPACE_ROUTE_LINKS.superAdminApprovals, icon: '✅' },
                { label: 'Subscriptions', route: WORKSPACE_ROUTE_LINKS.superAdminSubscriptions, icon: '💳' },
                { label: 'Billing', route: WORKSPACE_ROUTE_LINKS.superAdminBilling, icon: '🧾' },
                { label: 'Roles', route: WORKSPACE_ROUTE_LINKS.superAdminRoles, icon: '🛡️' },
                { label: 'Security', route: WORKSPACE_ROUTE_LINKS.superAdminSecurity, icon: '🔐' },
                { label: 'Audit Logs', route: WORKSPACE_ROUTE_LINKS.superAdminAuditLogs, icon: '🗄️' }
              ]
            },
            {
              title: 'Insights',
              items: [
                { label: 'Advertisements', route: WORKSPACE_ROUTE_LINKS.superAdminAdvertisements, icon: '📢' },
                { label: 'Stories', route: WORKSPACE_ROUTE_LINKS.superAdminStories, icon: '🎬' },
                { label: 'Support', route: WORKSPACE_ROUTE_LINKS.superAdminSupport, icon: '💬' },
                { label: 'Analytics', route: WORKSPACE_ROUTE_LINKS.superAdminAnalytics, icon: '📈' },
                { label: 'Reports', route: WORKSPACE_ROUTE_LINKS.superAdminReports, icon: '📄' },
                { label: 'Categories', route: WORKSPACE_ROUTE_LINKS.superAdminCategories, icon: '🗂️' },
                { label: 'Territories', route: WORKSPACE_ROUTE_LINKS.superAdminTerritories, icon: '🌍' },
                { label: 'Data', route: WORKSPACE_ROUTE_LINKS.superAdminDataManagement, icon: '🗃️' },
                { label: 'Settings', route: WORKSPACE_ROUTE_LINKS.superAdminSettings, icon: '⚙️' }
              ]
            }
          ],
          mobileNavItems: [
            { label: 'Dashboard', route: WORKSPACE_ROUTE_LINKS.superAdminRoot, icon: '🏠', exact: true },
            { label: 'Approvals', route: WORKSPACE_ROUTE_LINKS.superAdminApprovals, icon: '✅' },
            { label: 'Support', route: WORKSPACE_ROUTE_LINKS.superAdminSupport, icon: '💬' },
            { label: 'Analytics', route: WORKSPACE_ROUTE_LINKS.superAdminAnalytics, icon: '📈' },
            { label: 'Settings', route: WORKSPACE_ROUTE_LINKS.superAdminSettings, icon: '⚙️' }
          ]
        };
      default:
        return this.getConfig('retailer');
    }
  }
}
