/**
 * API Endpoints Configuration
 * Centralized endpoint definitions to avoid hardcoded URLs
 */

export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_OTP: '/auth/resend-otp',
    REGISTER: '/auth/register',
    REGISTER_RETAILER: '/auth/register-retailer',
    REGISTER_COMPANY: '/auth/register-company',
    REGISTER_DISTRIBUTOR: '/auth/register-distributor',
    REGISTER_SALESMAN: '/auth/register-salesman',
  },

  // Product Endpoints
  PRODUCTS: {
    BASE: '/products',
    GET_ALL: '/products',
    GET_BY_ID: '/products/:productId',
    CREATE: '/products',
    UPDATE: '/products/:productId',
    DELETE: '/products/:productId',
    UPLOAD_IMAGE: '/products/:productId/upload-image',
    SEARCH: '/products/search',
    BY_CATEGORY: '/products/category/:category',
  },

  // Order Endpoints
  ORDERS: {
    BASE: '/orders',
    GET_ALL: '/orders',
    GET_BY_ID: '/orders/:orderId',
    CREATE: '/orders',
    UPDATE: '/orders/:orderId',
    DELETE: '/orders/:orderId',
    APPROVE: '/orders/:orderId/approve',
    CANCEL: '/orders/:orderId/cancel',
    STATUS_CHANGE: '/orders/:orderId/status',
    GET_BY_RETAILER: '/orders/retailer/:retailerId',
    GET_BY_DISTRIBUTOR: '/orders/distributor/:distributorId',
  },

  // Retailer Endpoints
  RETAILERS: {
    BASE: '/retailers',
    GET_ALL: '/retailers',
    GET_BY_ID: '/retailers/:retailerId',
    CREATE: '/retailers',
    UPDATE: '/retailers/:retailerId',
    DELETE: '/retailers/:retailerId',
    APPROVE: '/retailers/:retailerId/approve',
    UPLOAD_DOCUMENTS: '/retailers/:retailerId/upload-documents',
    GET_BY_DISTRIBUTOR: '/retailers/distributor/:distributorId',
  },

  // Distributor Endpoints
  DISTRIBUTORS: {
    BASE: '/distributors',
    GET_ALL: '/distributors',
    GET_BY_ID: '/distributors/:distributorId',
    CREATE: '/distributors',
    UPDATE: '/distributors/:distributorId',
    DELETE: '/distributors/:distributorId',
    APPROVE: '/distributors/:distributorId/approve',
    REJECT: '/distributors/:distributorId/reject',
    GET_BY_COMPANY: '/distributors/company/:companyId',
  },

  // Company Endpoints
  COMPANIES: {
    BASE: '/companies',
    GET_ALL: '/companies',
    GET_BY_ID: '/companies/:companyId',
    CREATE: '/companies',
    UPDATE: '/companies/:companyId',
    DELETE: '/companies/:companyId',
    GET_PROFILE: '/companies/profile',
  },

  // Salesman Endpoints
  SALESMEN: {
    BASE: '/salesmen',
    GET_ALL: '/salesmen',
    GET_BY_ID: '/salesmen/:salesmanId',
    CREATE: '/salesmen',
    UPDATE: '/salesmen/:salesmanId',
    DELETE: '/salesmen/:salesmanId',
    GET_BY_DISTRIBUTOR: '/salesmen/distributor/:distributorId',
    GET_PERFORMANCE: '/salesmen/:salesmanId/performance',
  },

  // Pricing Endpoints
  PRICING: {
    BASE: '/pricing',
    GET_ALL: '/pricing',
    GET_BY_ID: '/pricing/:priceId',
    CREATE: '/pricing',
    UPDATE: '/pricing/:priceId',
    DELETE: '/pricing/:priceId',
    GET_BY_PRODUCT: '/pricing/product/:productId',
    GET_BY_DISTRIBUTOR: '/pricing/distributor/:distributorId',
  },

  // Inventory Endpoints
  INVENTORY: {
    BASE: '/inventory',
    GET_ALL: '/inventory',
    GET_BY_ID: '/inventory/:inventoryId',
    CREATE: '/inventory',
    UPDATE: '/inventory/:inventoryId',
    DELETE: '/inventory/:inventoryId',
    GET_BY_DISTRIBUTOR: '/inventory/distributor/:distributorId',
    GET_LOW_STOCK: '/inventory/low-stock',
    ADJUST_STOCK: '/inventory/:inventoryId/adjust',
  },

  // Invoice Endpoints
  INVOICES: {
    BASE: '/invoices',
    GET_ALL: '/invoices',
    GET_BY_ID: '/invoices/:invoiceId',
    CREATE: '/invoices',
    UPDATE: '/invoices/:invoiceId',
    DELETE: '/invoices/:invoiceId',
    DOWNLOAD_PDF: '/invoices/:invoiceId/pdf',
    GET_BY_ORDER: '/invoices/order/:orderId',
    MARK_PAID: '/invoices/:invoiceId/mark-paid',
  },

  // Payment Endpoints
  PAYMENTS: {
    BASE: '/payments',
    GET_ALL: '/payments',
    GET_BY_ID: '/payments/:paymentId',
    CREATE: '/payments',
    UPDATE: '/payments/:paymentId',
    DELETE: '/payments/:paymentId',
    VERIFY_PAYMENT: '/payments/:paymentId/verify',
    GET_BY_INVOICE: '/payments/invoice/:invoiceId',
  },

  // Visit Endpoints
  VISITS: {
    BASE: '/visits',
    GET_ALL: '/visits',
    GET_BY_ID: '/visits/:visitId',
    CREATE: '/visits',
    UPDATE: '/visits/:visitId',
    DELETE: '/visits/:visitId',
    GET_BY_SALESMAN: '/visits/salesman/:salesmanId',
    GET_BY_RETAILER: '/visits/retailer/:retailerId',
    CHECK_IN: '/visits/:visitId/check-in',
    CHECK_OUT: '/visits/:visitId/check-out',
  },

  // Collection Endpoints
  COLLECTIONS: {
    BASE: '/collections',
    GET_ALL: '/collections',
    GET_BY_ID: '/collections/:collectionId',
    CREATE: '/collections',
    UPDATE: '/collections/:collectionId',
    DELETE: '/collections/:collectionId',
    GET_BY_SALESMAN: '/collections/salesman/:salesmanId',
    GET_BY_RETAILER: '/collections/retailer/:retailerId',
  },

  // Sample Endpoints
  SAMPLES: {
    BASE: '/samples',
    GET_ALL: '/samples',
    GET_BY_ID: '/samples/:sampleId',
    CREATE: '/samples',
    UPDATE: '/samples/:sampleId',
    DELETE: '/samples/:sampleId',
    GET_BY_RETAILER: '/samples/retailer/:retailerId',
  },

  // Story Endpoints
  STORIES: {
    BASE: '/stories',
    GET_ALL: '/stories',
    GET_BY_ID: '/stories/:storyId',
    CREATE: '/stories',
    UPDATE: '/stories/:storyId',
    DELETE: '/stories/:storyId',
    UPLOAD_MEDIA: '/stories/:storyId/upload-media',
  },

  // Review Endpoints
  REVIEWS: {
    BASE: '/reviews',
    GET_ALL: '/reviews',
    GET_BY_ID: '/reviews/:reviewId',
    CREATE: '/reviews',
    UPDATE: '/reviews/:reviewId',
    DELETE: '/reviews/:reviewId',
    GET_BY_PRODUCT: '/reviews/product/:productId',
    GET_BY_RETAILER: '/reviews/retailer/:retailerId',
  },

  // Return Endpoints
  RETURNS: {
    BASE: '/returns',
    GET_ALL: '/returns',
    GET_BY_ID: '/returns/:returnId',
    CREATE: '/returns',
    UPDATE: '/returns/:returnId',
    DELETE: '/returns/:returnId',
    GET_BY_ORDER: '/returns/order/:orderId',
    APPROVE: '/returns/:returnId/approve',
  },

  // Notification Endpoints
  NOTIFICATIONS: {
    BASE: '/notifications',
    GET_ALL: '/notifications',
    GET_BY_ID: '/notifications/:notificationId',
    CREATE: '/notifications',
    UPDATE: '/notifications/:notificationId',
    DELETE: '/notifications/:notificationId',
    MARK_READ: '/notifications/:notificationId/mark-read',
    MARK_ALL_READ: '/notifications/mark-all-read',
  },

  // Dashboard Endpoints
  DASHBOARD: {
    BASE: '/dashboard',
    // summary is implemented in backend (analyticsController.getSummary)
    GET_SUMMARY: '/dashboard/summary',
    // map dashboard collection endpoints to existing resource routes
    GET_ORDERS: '/orders',
    GET_INVENTORY: '/inventory',
    GET_PAYMENTS: '/payments',
    GET_COLLECTIONS: '/collections',
    GET_VISITS: '/visits',
    // metrics and charts live under analytics
    GET_METRICS: '/analytics/summary',
    GET_CHARTS: '/analytics/sales-performance',
  },

  // Analytics Endpoints
  ANALYTICS: {
    BASE: '/analytics',
    GET_SALES: '/analytics/sales',
    GET_PERFORMANCE: '/analytics/performance',
    GET_TRENDS: '/analytics/trends',
    GET_REPORTS: '/analytics/reports',
    GET_INVENTORY: '/analytics/inventory-performance',
    EXPORT_REPORT: '/analytics/export',
  },

  // RBAC Endpoints
  RBAC: {
    PERMISSIONS_BASE: '/rbac/permissions',
    PERMISSIONS_GET_ALL: '/rbac/permissions',
    PERMISSIONS_GET_BY_ID: '/rbac/permissions/:permissionId',
    PERMISSIONS_CREATE: '/rbac/permissions',
    PERMISSIONS_UPDATE: '/rbac/permissions/:permissionId',
    PERMISSIONS_DELETE: '/rbac/permissions/:permissionId',

    ROLES_BASE: '/rbac/roles',
    ROLES_GET_ALL: '/rbac/roles',
    ROLES_GET_BY_ID: '/rbac/roles/:roleId',
    ROLES_CREATE: '/rbac/roles',
    ROLES_UPDATE: '/rbac/roles/:roleId',
    ROLES_DELETE: '/rbac/roles/:roleId',
    ROLES_GET_BY_TENANT: '/rbac/roles/tenant/:tenantId',

    USER_ROLES_BASE: '/rbac/user-roles',
    USER_ROLES_GET_ALL: '/rbac/user-roles',
    USER_ROLES_CREATE: '/rbac/user-roles',
    USER_ROLES_DELETE: '/rbac/user-roles/:userRoleId',
    USER_ROLES_BY_USER: '/rbac/user-roles/user/:userId',
  },

  // Territory Endpoints
  TERRITORIES: {
    BASE: '/territories',
    GET_ALL: '/territories',
    GET_BY_ID: '/territories/:territoryId',
    CREATE: '/territories',
    UPDATE: '/territories/:territoryId',
    DELETE: '/territories/:territoryId',
  },

  // Feedback Endpoints
  FEEDBACKS: {
    BASE: '/feedbacks',
    GET_ALL: '/feedbacks',
    GET_BY_ID: '/feedbacks/:feedbackId',
    CREATE: '/feedbacks',
    UPDATE: '/feedbacks/:feedbackId',
    DELETE: '/feedbacks/:feedbackId',
  },

  // Follow-up Endpoints
  FOLLOWUPS: {
    BASE: '/followups',
    GET_ALL: '/followups',
    GET_BY_ID: '/followups/:followupId',
    CREATE: '/followups',
    UPDATE: '/followups/:followupId',
    DELETE: '/followups/:followupId',
    GET_BY_RETAILER: '/followups/retailer/:retailerId',
  },

  // Registration Endpoints
  REGISTRATIONS: {
    BASE: '/registrations',
    REQUESTS: {
      GET_ALL: '/registrations/requests',
      GET_BY_ID: '/registrations/requests/:requestId',
      CREATE: '/registrations/requests',
      UPDATE: '/registrations/requests/:requestId',
    },
    COMPANIES: {
      GET_ALL: '/registrations/companies',
      GET_BY_ID: '/registrations/companies/:companyId',
      APPROVE: '/registrations/companies/:companyId/approve',
      REJECT: '/registrations/companies/:companyId/reject',
    },
    DISTRIBUTORS: {
      GET_ALL: '/registrations/distributors',
      GET_BY_ID: '/registrations/distributors/:distributorId',
      APPROVE: '/registrations/distributors/:distributorId/approve',
      REJECT: '/registrations/distributors/:distributorId/reject',
    },
    RETAILERS: {
      GET_ALL: '/registrations/retailers',
      GET_BY_ID: '/registrations/retailers/:retailerId',
      APPROVE: '/registrations/retailers/:retailerId/approve',
      REJECT: '/registrations/retailers/:retailerId/reject',
    },
    SALESMEN: {
      GET_ALL: '/registrations/salesmen',
      GET_BY_ID: '/registrations/salesmen/:salesmanId',
      APPROVE: '/registrations/salesmen/:salesmanId/approve',
      REJECT: '/registrations/salesmen/:salesmanId/reject',
    },
  },
};

/**
 * API Base URL - loaded from environment
 */
let baseUrl = '/api'; // Default fallback for same-origin or proxy setups

if (typeof window !== 'undefined') {
  const runtimeEnv = (window as any).__ENV;
  if (runtimeEnv?.NG_APP_API_BASE_URL) {
    baseUrl = runtimeEnv.NG_APP_API_BASE_URL;
  } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    baseUrl = `${window.location.protocol}//${window.location.hostname}:4000/api`;
  }
}

export const API_BASE_URL = baseUrl;

/**
 * Get full API URL
 */
export function getApiUrl(endpoint: string, params?: Record<string, string>): string {
  let url = API_BASE_URL + endpoint;

  if (params) {
    Object.keys(params).forEach((key) => {
      url = url.replace(`:${key}`, params[key]);
    });
  }

  return url;
}
