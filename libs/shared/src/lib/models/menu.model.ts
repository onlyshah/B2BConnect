/**
 * Menu Configuration Model - Dynamically Generated from Permissions
 * Menus are NOT hardcoded - built from database configuration
 */

export interface MenuItem {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  badge?: {
    text: string;
    color: string;
  };
  permission?: string; // 'product.view', 'order.view', etc.
  children?: MenuItem[];
  order: number;
  divider?: boolean;
  external?: boolean;
  query?: Record<string, string>;
}

export interface MenuConfig {
  id: string;
  name: string; // 'company-menu', 'distributor-menu', 'retailer-menu'
  tenantId: string;
  items: MenuItem[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuGroup {
  groupName: string;
  items: MenuItem[];
}

// Predefined menu structure (for reference)
export const DEFAULT_MENU_STRUCTURE: Record<string, MenuItem[]> = {
  company: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'home',
      permission: 'dashboard.view',
      order: 1,
    },
    {
      id: 'products',
      label: 'Products',
      route: '/products',
      icon: 'cube',
      permission: 'product.view',
      order: 2,
    },
    {
      id: 'orders',
      label: 'Orders',
      route: '/orders',
      icon: 'bag',
      permission: 'order.view',
      order: 3,
    },
    {
      id: 'distributors',
      label: 'Distributors',
      route: '/distributors',
      icon: 'people',
      permission: 'distributor.view',
      order: 4,
    },
    {
      id: 'salesmen',
      label: 'Sales Team',
      route: '/salesmen',
      icon: 'people-circle',
      permission: 'salesman.view',
      order: 5,
    },
    {
      id: 'retailers',
      label: 'Retailers',
      route: '/retailers',
      icon: 'storefront',
      permission: 'retailer.view',
      order: 6,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      route: '/analytics',
      icon: 'bar-chart',
      permission: 'analytics.view',
      order: 7,
      children: [
        {
          id: 'sales-analytics',
          label: 'Sales Analytics',
          route: '/analytics/sales',
          icon: 'trending-up',
          permission: 'analytics.sales.view',
          order: 1,
        },
        {
          id: 'inventory-analytics',
          label: 'Inventory Analytics',
          route: '/analytics/inventory',
          icon: 'layers',
          permission: 'analytics.inventory.view',
          order: 2,
        },
      ],
    },
  ],
  distributor: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'home',
      permission: 'dashboard.view',
      order: 1,
    },
    {
      id: 'orders',
      label: "Today's Orders",
      route: '/orders',
      icon: 'bag',
      permission: 'order.view',
      order: 2,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      route: '/inventory',
      icon: 'layers',
      permission: 'inventory.view',
      order: 3,
    },
    {
      id: 'retailers',
      label: 'Retailers',
      route: '/retailers',
      icon: 'storefront',
      permission: 'retailer.view',
      order: 4,
    },
    {
      id: 'collections',
      label: 'Collections',
      route: '/collections',
      icon: 'cash',
      permission: 'collection.view',
      order: 5,
    },
    {
      id: 'invoices',
      label: 'Invoices',
      route: '/invoices',
      icon: 'document',
      permission: 'invoice.view',
      order: 6,
    },
  ],
  salesman: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'home',
      permission: 'dashboard.view',
      order: 1,
    },
    {
      id: 'retailers',
      label: 'My Retailers',
      route: '/retailers',
      icon: 'storefront',
      permission: 'retailer.view',
      order: 2,
    },
    {
      id: 'orders',
      label: 'Orders',
      route: '/orders',
      icon: 'bag',
      permission: 'order.view',
      order: 3,
    },
    {
      id: 'samples',
      label: 'Samples',
      route: '/samples',
      icon: 'cube',
      permission: 'sample.view',
      order: 4,
    },
    {
      id: 'visits',
      label: 'My Visits',
      route: '/visits',
      icon: 'map',
      permission: 'visit.view',
      order: 5,
    },
  ],
  retailer: [
    {
      id: 'home',
      label: 'Home',
      route: '/home',
      icon: 'home',
      permission: 'dashboard.view',
      order: 1,
    },
    {
      id: 'products',
      label: 'Products',
      route: '/products',
      icon: 'cube',
      permission: 'product.view',
      order: 2,
    },
    {
      id: 'orders',
      label: 'My Orders',
      route: '/orders',
      icon: 'bag',
      permission: 'order.view',
      order: 3,
    },
    {
      id: 'payments',
      label: 'Payments',
      route: '/payments',
      icon: 'cash',
      permission: 'payment.view',
      order: 4,
    },
    {
      id: 'stories',
      label: 'Stories',
      route: '/stories',
      icon: 'image',
      permission: 'story.view',
      order: 5,
    },
  ],
};
