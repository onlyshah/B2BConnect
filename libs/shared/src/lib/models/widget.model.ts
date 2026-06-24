/**
 * Dashboard Widget Configuration Model
 * Widgets are dynamically configured, not hardcoded for each role
 */

export type WidgetType =
  | 'kpi'
  | 'chart'
  | 'table'
  | 'list'
  | 'calendar'
  | 'timeline'
  | 'stats'
  | 'progress'
  | 'map'
  | 'custom';

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'radar' | 'bubble';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  icon?: string;
  order: number;
  
  // Dimensions
  gridCol?: number; // 1-4
  gridRow?: number; // 1-3
  
  // Data
  dataUrl?: string; // API endpoint to fetch data
  refreshInterval?: number; // in seconds
  
  // Permissions - Show only if user has permission
  permissions?: string[];
  
  // Component configuration
  config?: WidgetComponentConfig;
  
  // Styling
  theme?: 'light' | 'dark' | 'custom';
  backgroundColor?: string;
  
  // Actions
  actions?: WidgetAction[];
  
  // Conditional display
  visibleWhen?: (context: any) => boolean;
}

export interface WidgetComponentConfig {
  // KPI Widget
  metric?: string;
  unit?: string;
  format?: 'number' | 'currency' | 'percentage' | 'time';
  comparison?: {
    label: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  };
  
  // Chart Widget
  chartType?: ChartType;
  xAxis?: string;
  yAxis?: string;
  series?: string[];
  
  // Table Widget
  columns?: string[];
  pageSize?: number;
  sortBy?: string;
  filters?: Record<string, any>;
  
  // List Widget
  itemTemplate?: string;
  emptyMessage?: string;
  
  // Custom config
  [key: string]: any;
}

export interface WidgetAction {
  id: string;
  label: string;
  icon?: string;
  permission: string;
  action: 'navigate' | 'api' | 'custom';
  target?: string; // URL for navigate
  endpoint?: string; // Endpoint for API call
}

export interface DashboardLayout {
  id: string;
  name: string; // 'company-dashboard', 'distributor-dashboard'
  title: string;
  description?: string;
  widgets: WidgetConfig[];
  gridSize?: {
    columns: number;
    rows: number;
  };
  permissions?: string[]; // Required to view dashboard
  tenantId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Predefined Dashboard Configurations
export const COMPANY_DASHBOARD: DashboardLayout = {
  id: 'company-dashboard',
  name: 'company-dashboard',
  title: 'Company Dashboard',
  widgets: [
    {
      id: 'total-sales',
      type: 'kpi',
      title: 'Total Sales',
      order: 1,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'sales.view'],
      dataUrl: '/api/dashboard/sales-total',
      config: {
        metric: 'totalSales',
        format: 'currency',
        comparison: { label: 'vs last month', value: 12.5, trend: 'up' },
      },
    },
    {
      id: 'active-orders',
      type: 'kpi',
      title: 'Active Orders',
      order: 2,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'order.view'],
      dataUrl: '/api/dashboard/active-orders',
      config: {
        metric: 'activeOrders',
        format: 'number',
      },
    },
    {
      id: 'distributor-growth',
      type: 'kpi',
      title: 'Active Distributors',
      order: 3,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'distributor.view'],
      dataUrl: '/api/dashboard/active-distributors',
      config: {
        metric: 'activeDistributors',
        format: 'number',
      },
    },
    {
      id: 'retailer-growth',
      type: 'kpi',
      title: 'Active Retailers',
      order: 4,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'retailer.view'],
      dataUrl: '/api/dashboard/active-retailers',
      config: {
        metric: 'activeRetailers',
        format: 'number',
      },
    },
    {
      id: 'sales-chart',
      type: 'chart',
      title: 'Sales Trend',
      order: 5,
      gridCol: 2,
      gridRow: 2,
      permissions: ['dashboard.view', 'sales.view'],
      dataUrl: '/api/dashboard/sales-trend',
      config: {
        chartType: 'line',
        xAxis: 'date',
        yAxis: 'sales',
      },
    },
    {
      id: 'top-products',
      type: 'table',
      title: 'Top Products',
      order: 6,
      gridCol: 2,
      gridRow: 2,
      permissions: ['dashboard.view', 'product.view'],
      dataUrl: '/api/dashboard/top-products',
      config: {
        columns: ['name', 'sales', 'quantity', 'revenue'],
        pageSize: 5,
      },
    },
  ],
  gridSize: { columns: 4, rows: 4 },
  tenantId: '',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const DISTRIBUTOR_DASHBOARD: DashboardLayout = {
  id: 'distributor-dashboard',
  name: 'distributor-dashboard',
  title: 'Distributor Dashboard',
  widgets: [
    {
      id: 'todays-orders',
      type: 'kpi',
      title: "Today's Orders",
      order: 1,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'order.view'],
      dataUrl: '/api/dashboard/todays-orders',
      config: { metric: 'todaysOrders', format: 'number' },
    },
    {
      id: 'inventory-status',
      type: 'kpi',
      title: 'Stock Items',
      order: 2,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'inventory.view'],
      dataUrl: '/api/dashboard/inventory-count',
      config: { metric: 'stockItems', format: 'number' },
    },
    {
      id: 'outstanding-collections',
      type: 'kpi',
      title: 'Collections Due',
      order: 3,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'collection.view'],
      dataUrl: '/api/dashboard/outstanding-collections',
      config: { metric: 'outstandingCollections', format: 'currency' },
    },
    {
      id: 'active-retailers',
      type: 'kpi',
      title: 'Active Retailers',
      order: 4,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'retailer.view'],
      dataUrl: '/api/dashboard/active-retailers',
      config: { metric: 'activeRetailers', format: 'number' },
    },
    {
      id: 'pending-orders',
      type: 'table',
      title: 'Pending Orders',
      order: 5,
      gridCol: 2,
      gridRow: 2,
      permissions: ['dashboard.view', 'order.view'],
      dataUrl: '/api/dashboard/pending-orders',
      config: {
        columns: ['retailerName', 'orderDate', 'total', 'status'],
        pageSize: 5,
      },
    },
  ],
  gridSize: { columns: 4, rows: 4 },
  tenantId: '',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const SALESMAN_DASHBOARD: DashboardLayout = {
  id: 'salesman-dashboard',
  name: 'salesman-dashboard',
  title: 'Salesman Dashboard',
  widgets: [
    {
      id: 'today-visits',
      type: 'kpi',
      title: "Today's Visits",
      order: 1,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'visit.view'],
      dataUrl: '/api/dashboard/todays-visits',
      config: { metric: 'todaysVisits', format: 'number' },
    },
    {
      id: 'orders-generated',
      type: 'kpi',
      title: 'Orders Generated',
      order: 2,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'order.view'],
      dataUrl: '/api/dashboard/orders-generated',
      config: { metric: 'ordersGenerated', format: 'number' },
    },
    {
      id: 'target-achievement',
      type: 'kpi',
      title: 'Target Achievement',
      order: 3,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'target.view'],
      dataUrl: '/api/dashboard/target-achievement',
      config: { metric: 'targetAchievement', format: 'percentage' },
    },
    {
      id: 'pending-followups',
      type: 'list',
      title: 'Pending Follow-ups',
      order: 4,
      gridCol: 2,
      gridRow: 2,
      permissions: ['dashboard.view', 'followup.view'],
      dataUrl: '/api/dashboard/pending-followups',
    },
  ],
  gridSize: { columns: 4, rows: 4 },
  tenantId: '',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const RETAILER_DASHBOARD: DashboardLayout = {
  id: 'retailer-dashboard',
  name: 'retailer-dashboard',
  title: 'Retailer Dashboard',
  widgets: [
    {
      id: 'recent-orders',
      type: 'kpi',
      title: 'Recent Orders',
      order: 1,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'order.view'],
      dataUrl: '/api/dashboard/recent-orders-count',
      config: { metric: 'recentOrders', format: 'number' },
    },
    {
      id: 'outstanding-balance',
      type: 'kpi',
      title: 'Outstanding Balance',
      order: 2,
      gridCol: 1,
      gridRow: 1,
      permissions: ['dashboard.view', 'payment.view'],
      dataUrl: '/api/dashboard/outstanding-balance',
      config: { metric: 'outstandingBalance', format: 'currency' },
    },
    {
      id: 'active-offers',
      type: 'list',
      title: 'Active Offers',
      order: 3,
      gridCol: 2,
      gridRow: 2,
      permissions: ['dashboard.view', 'offer.view'],
      dataUrl: '/api/dashboard/active-offers',
    },
    {
      id: 'new-products',
      type: 'table',
      title: 'New Products',
      order: 4,
      gridCol: 2,
      gridRow: 2,
      permissions: ['dashboard.view', 'product.view'],
      dataUrl: '/api/dashboard/new-products',
      config: {
        columns: ['name', 'category', 'price'],
        pageSize: 5,
      },
    },
  ],
  gridSize: { columns: 4, rows: 4 },
  tenantId: '',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
