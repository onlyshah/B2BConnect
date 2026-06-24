# B2BConnect Integration Audit

## Route → Service → Component → Screen Traceability

### Authentication
- Route: /login
- Service: AuthService
- Component: LoginComponent
- Backend: /api/auth/login, /api/auth/register, /api/auth/me
- Notes: Redirects users into role-based workspaces after successful login.

### Company workspace
- Route: /company
- Service: CompanyService
- Component: CompanyLayoutComponent and company feature components
- Backend: /api/companies, /api/dashboard, /api/analytics
- Screens: dashboard, products, distributors, retailers, orders, profile

### Distributor workspace
- Route: /distributor
- Service: DistributorService
- Component: DistributorLayoutComponent and distributor feature components
- Backend: /api/distributors, /api/orders, /api/analytics, /api/collections
- Screens: dashboard, orders, retailers, collections, performance

### Retailer workspace
- Route: /retailer
- Service: RetailerService
- Component: RetailerLayoutComponent and retailer feature components
- Backend: /api/retailers, /api/products, /api/orders, /api/samples
- Screens: dashboard, products, orders, samples, profile

### Salesman workspace
- Route: /salesman
- Service: SalesmanService
- Component: SalesmanLayoutComponent and salesman feature components
- Backend: /api/salesmen, /api/visits, /api/salesman-orders, /api/collections, /api/followups
- Screens: dashboard, visits, orders, follow-ups, feedback

### Super-admin workspace
- Route: /super-admin
- Service: SuperAdminService
- Component: SuperAdminLayoutComponent and super-admin feature components
- Backend: /api/companies, /api/distributors, /api/retailers, /api/analytics, /api/hierarchy
- Screens: dashboard, hierarchy, users, approvals, analytics

## Shared Platform Infrastructure
- API wrapper: ApiService
- Success/error/toast handling: ResponseHandlerService
- Loading state: LoadingInterceptor
- Error mapping: ErrorInterceptor
- Auth headers: AuthInterceptor
- Tenant context: TenantInterceptor

## Current Gaps
- Some role screens still use local mock data rather than full backend-backed services.
- The product catalog route is available but should be expanded with richer filters, pagination, and detail views.
- A small set of backend controllers still use older response shapes and should be standardized over time.

## Verification Status
- Frontend build: expected to be validated with npm run build.
- Backend seed: expected to be validated with the existing seed script.
