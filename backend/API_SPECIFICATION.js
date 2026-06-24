/**
 * BACKEND API SPECIFICATION FOR CONFIGURATION-DRIVEN ARCHITECTURE
 * ================================================================
 * 
 * All endpoints must support multi-tenancy:
 * - Every request includes x-tenant-id header
 * - Every response is tenant-isolated
 * - No cross-tenant data leakage
 */

// ============================================================================
// 1. PERMISSIONS & ROLES API
// ============================================================================

/**
 * GET /api/rbac/user-context
 * Get user's complete permission context (called on login)
 * 
 * Response:
 * {
 *   userId: string,
 *   tenantId: string,
 *   roles: [
 *     { id, name, description, permissions: [...] }
 *   ],
 *   permissions: [
 *     { id, module, action, description }
 *   ],
 *   features: ['feature1', 'feature2'] // subscription features
 * }
 */

/**
 * GET /api/rbac/permissions?module=product&action=create
 * Get all permissions (for role management)
 */

/**
 * GET /api/rbac/roles
 * Get all roles for tenant
 * Query params: roleType, scope
 */

/**
 * POST /api/rbac/roles
 * Create new role
 * Body: { name, description, permissions: [] }
 */

/**
 * PUT /api/rbac/roles/:id
 * Update role
 * Body: { name, description, permissions: [] }
 */

/**
 * POST /api/rbac/roles/:id/permissions
 * Assign permission to role
 * Body: { permissionId }
 */

/**
 * POST /api/rbac/users/:id/roles
 * Assign role to user
 * Body: { roleId }
 */

/**
 * GET /api/rbac/audit-logs?userId=xyz&module=product
 * Get audit trail
 */

// ============================================================================
// 2. MENUS API
// ============================================================================

/**
 * GET /api/menus/for-tenant
 * Get menu configuration for current tenant
 * Includes all menu items, permissions handled by frontend
 * 
 * Response:
 * {
 *   menu: [
 *     {
 *       id: 'dashboard',
 *       label: 'Dashboard',
 *       route: '/dashboard',
 *       icon: 'home',
 *       permission: 'dashboard.view',
 *       order: 1,
 *       children: [...]
 *     }
 *   ]
 * }
 */

/**
 * GET /api/menus
 * Get all menu configurations (for management)
 */

/**
 * GET /api/menus/:id
 * Get specific menu config
 */

/**
 * POST /api/menus
 * Create menu configuration
 */

/**
 * PUT /api/menus/:id
 * Update menu configuration
 */

/**
 * POST /api/menus/:id/items
 * Add menu item
 */

// ============================================================================
// 3. DASHBOARDS API
// ============================================================================

/**
 * GET /api/dashboards/for-user
 * Get dashboard configuration for current user
 * Backend filters widgets by user's permissions
 * 
 * Response:
 * {
 *   id: 'company-dashboard',
 *   title: 'Company Dashboard',
 *   widgets: [
 *     {
 *       id: 'total-sales',
 *       type: 'kpi',
 *       title: 'Total Sales',
 *       dataUrl: '/api/dashboard/sales-total',
 *       permissions: ['dashboard.view', 'sales.view'],
 *       config: { metric: 'totalSales', format: 'currency' }
 *     }
 *   ]
 * }
 */

/**
 * GET /api/dashboards
 * Get all dashboard configs (for management)
 */

/**
 * GET /api/dashboards/:id
 * Get specific dashboard
 */

/**
 * POST /api/dashboards
 * Create dashboard
 */

/**
 * PUT /api/dashboards/:id
 * Update dashboard
 */

/**
 * POST /api/dashboards/:id/widgets
 * Add widget to dashboard
 */

/**
 * DELETE /api/dashboards/:id/widgets/:widgetId
 * Remove widget from dashboard
 */

/**
 * GET /api/dashboard/:widgetId/data
 * Get data for specific widget
 * Returns data formatted for widget
 */

// ============================================================================
// 4. FORMS API
// ============================================================================

/**
 * GET /api/forms/:id
 * Get form configuration
 * 
 * Response:
 * {
 *   id: 'product-form',
 *   title: 'Product Details',
 *   layout: 'two-column',
 *   sections: [
 *     {
 *       name: 'basic',
 *       title: 'Basic Information',
 *       fields: [
 *         {
 *           name: 'name',
 *           label: 'Product Name',
 *           type: 'text',
 *           required: true,
 *           validators: [...],
 *           permissions: ['product.edit.basic']
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

/**
 * POST /api/forms/:id/submit
 * Submit form data
 * Body: { formData }
 * Response: { success, submissionId, redirectUrl }
 */

/**
 * GET /api/forms/:id/submissions
 * Get form submissions
 * Query: limit, offset, status
 */

/**
 * GET /api/form-fields/:fieldId/options
 * Get options for select/autocomplete fields
 * Query: search, limit
 */

// ============================================================================
// 5. ACTIONS API
// ============================================================================

/**
 * GET /api/actions/context-menu/:resourceType
 * Get context menu actions for resource
 * Frontend filters by permissions
 * 
 * Response:
 * {
 *   resourceType: 'product',
 *   actions: [
 *     {
 *       id: 'edit',
 *       label: 'Edit',
 *       permission: 'product.update',
 *       type: 'secondary',
 *       action: 'open-modal'
 *     }
 *   ]
 * }
 */

/**
 * GET /api/actions/bulk-actions/:resourceType
 * Get bulk actions available
 */

/**
 * POST /api/actions/execute
 * Execute an action
 * Body: { actionId, resourceId, context }
 */

// ============================================================================
// 6. FEATURES API (PRODUCTS, ORDERS, ETC.)
// ============================================================================

/**
 * All feature modules follow same pattern:
 * GET /api/products
 * GET /api/products/:id
 * POST /api/products
 * PUT /api/products/:id
 * DELETE /api/products/:id
 * 
 * Key points:
 * - All include x-tenant-id header validation
 * - Backend applies permission checks
 * - Return 403 if permission denied
 * - Return 404 if not found or no permission
 * - Log all actions to AuditLog
 */

/**
 * Products endpoints
 */
// GET /api/products - List products
// POST /api/products - Create product (requires product.create)
// GET /api/products/:id - Get product details
// PUT /api/products/:id - Update product (requires product.update)
// DELETE /api/products/:id - Delete product (requires product.delete)
// POST /api/products/:id/publish - Publish (requires product.publish)
// POST /api/products/:id/unpublish - Unpublish (requires product.unpublish)
// GET /api/products/:id/pricing - Get pricing (requires product.view.pricing)
// GET /api/products/:id/inventory - Get inventory (requires inventory.view)

/**
 * Orders endpoints
 */
// GET /api/orders - List orders
// POST /api/orders - Create order (requires order.create)
// GET /api/orders/:id - Get order details
// PUT /api/orders/:id - Update order (requires order.update)
// DELETE /api/orders/:id - Cancel order (requires order.cancel)
// POST /api/orders/:id/approve - Approve (requires order.approve)
// POST /api/orders/:id/reject - Reject (requires order.reject)
// GET /api/orders/:id/invoice - Download invoice

/**
 * Retailers endpoints
 */
// GET /api/retailers
// POST /api/retailers - Create (requires retailer.create)
// GET /api/retailers/:id
// PUT /api/retailers/:id - Update (requires retailer.update)
// POST /api/retailers/:id/approve - Approve (requires retailer.approve)

// ============================================================================
// 7. ERROR RESPONSES
// ============================================================================

/**
 * 401 Unauthorized
 * { error: 'Not authenticated' }
 */

/**
 * 403 Forbidden
 * { error: 'No permission for this action', required: 'product.create' }
 */

/**
 * 404 Not Found
 * { error: 'Resource not found' }
 */

/**
 * 400 Bad Request
 * { error: 'Validation failed', details: [...] }
 */

/**
 * 500 Server Error
 * { error: 'Internal server error' }
 */

// ============================================================================
// 8. IMPORTANT: BACKEND VALIDATION
// ============================================================================

/**
 * Every endpoint MUST:
 * 
 * 1. Validate x-tenant-id header
 * 2. Get user from JWT token
 * 3. Check if user belongs to tenant
 * 4. Load user's permissions
 * 5. Check required permission
 * 6. If denied: return 403
 * 7. Execute business logic
 * 8. Return tenant-isolated data
 * 9. Log action to AuditLog
 * 
 * Pseudo-code:
 * 
 * router.get('/api/products', async (req, res) => {
 *   const tenantId = req.headers['x-tenant-id'];
 *   const userId = req.user.id;
 *   
 *   // Validate tenant
 *   if (!tenantId || tenantId !== req.user.tenantId) {
 *     return res.status(403).json({ error: 'Unauthorized' });
 *   }
 *   
 *   // Get user permissions
 *   const permissions = await getUserPermissions(userId, tenantId);
 *   
 *   // Check permission
 *   if (!hasPermission(permissions, 'product.view')) {
 *     return res.status(403).json({ error: 'No permission' });
 *   }
 *   
 *   // Get data (filtered by tenantId)
 *   const products = await Product.find({ tenantId });
 *   
 *   // Log action
 *   await AuditLog.create({
 *     userId,
 *     tenantId,
 *     action: 'product.view',
 *     timestamp: new Date()
 *   });
 *   
 *   res.json({ products });
 * });
 */

// ============================================================================
// End of API Specification
// ============================================================================
