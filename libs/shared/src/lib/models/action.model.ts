/**
 * Dynamic Action System Model
 * Actions are permission-driven and contextual
 */

export interface UIAction {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  tooltip?: string;
  
  // Permission check
  permission: string; // e.g., 'product.create', 'order.approve'
  
  // Action behavior
  type: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  action: 'navigate' | 'api-call' | 'custom-handler' | 'open-modal' | 'download' | 'export';
  
  // Target/Endpoint
  target?: string; // URL for navigate
  endpoint?: string; // API endpoint
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  
  // UI Features
  confirmation?: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
  };
  
  // Loading & Feedback
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  
  // Conditional visibility
  visibleWhen?: (context: any) => boolean;
  disabled?: boolean;
  disabledReason?: string;
  
  // Order in action list
  order: number;
}

export interface ContextMenu {
  id: string;
  resourceType: string; // 'product', 'order', 'retailer', etc.
  actions: UIAction[];
}

export interface BulkAction {
  id: string;
  label: string;
  icon?: string;
  permission: string;
  type: 'primary' | 'secondary' | 'danger';
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  confirmation?: {
    title: string;
    message: string;
  };
  successMessage?: string;
  errorMessage?: string;
}

export const PRODUCT_ACTIONS: UIAction[] = [
  {
    id: 'create-product',
    label: 'Create Product',
    icon: 'add',
    color: 'primary',
    permission: 'product.create',
    type: 'primary',
    action: 'open-modal',
    target: '/products/create',
    order: 1,
  },
  {
    id: 'edit-product',
    label: 'Edit',
    icon: 'pencil',
    permission: 'product.update',
    type: 'secondary',
    action: 'open-modal',
    order: 2,
  },
  {
    id: 'view-product',
    label: 'View Details',
    icon: 'eye',
    permission: 'product.view',
    type: 'secondary',
    action: 'navigate',
    order: 3,
  },
  {
    id: 'delete-product',
    label: 'Delete',
    icon: 'trash',
    permission: 'product.delete',
    type: 'danger',
    action: 'api-call',
    endpoint: '/api/products/:id',
    method: 'DELETE',
    confirmation: {
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    },
    successMessage: 'Product deleted successfully',
    errorMessage: 'Failed to delete product',
    order: 4,
  },
  {
    id: 'publish-product',
    label: 'Publish',
    icon: 'check',
    permission: 'product.publish',
    type: 'success',
    action: 'api-call',
    endpoint: '/api/products/:id/publish',
    method: 'POST',
    successMessage: 'Product published successfully',
    order: 5,
  },
  {
    id: 'unpublish-product',
    label: 'Unpublish',
    icon: 'close',
    permission: 'product.unpublish',
    type: 'warning',
    action: 'api-call',
    endpoint: '/api/products/:id/unpublish',
    method: 'POST',
    successMessage: 'Product unpublished',
    order: 6,
  },
  {
    id: 'export-product',
    label: 'Export',
    icon: 'download',
    permission: 'product.export',
    type: 'secondary',
    action: 'download',
    endpoint: '/api/products/export',
    method: 'GET',
    order: 7,
  },
];

export const ORDER_ACTIONS: UIAction[] = [
  {
    id: 'create-order',
    label: 'Create Order',
    icon: 'add',
    permission: 'order.create',
    type: 'primary',
    action: 'open-modal',
    order: 1,
  },
  {
    id: 'view-order',
    label: 'View Order',
    icon: 'eye',
    permission: 'order.view',
    type: 'secondary',
    action: 'navigate',
    order: 2,
  },
  {
    id: 'edit-order',
    label: 'Edit',
    icon: 'pencil',
    permission: 'order.update',
    type: 'secondary',
    action: 'open-modal',
    order: 3,
  },
  {
    id: 'approve-order',
    label: 'Approve',
    icon: 'check',
    permission: 'order.approve',
    type: 'success',
    action: 'api-call',
    endpoint: '/api/orders/:id/approve',
    method: 'POST',
    confirmation: {
      title: 'Approve Order',
      message: 'Do you want to approve this order?',
    },
    successMessage: 'Order approved',
    order: 4,
  },
  {
    id: 'reject-order',
    label: 'Reject',
    icon: 'close',
    permission: 'order.reject',
    type: 'danger',
    action: 'api-call',
    endpoint: '/api/orders/:id/reject',
    method: 'POST',
    confirmation: {
      title: 'Reject Order',
      message: 'Are you sure you want to reject this order?',
    },
    successMessage: 'Order rejected',
    order: 5,
  },
  {
    id: 'cancel-order',
    label: 'Cancel',
    icon: 'stop',
    permission: 'order.cancel',
    type: 'danger',
    action: 'api-call',
    endpoint: '/api/orders/:id/cancel',
    method: 'POST',
    successMessage: 'Order cancelled',
    order: 6,
  },
  {
    id: 'download-invoice',
    label: 'Download Invoice',
    icon: 'download',
    permission: 'order.view',
    type: 'secondary',
    action: 'download',
    endpoint: '/api/orders/:id/invoice',
    method: 'GET',
    order: 7,
  },
];
