# B2BConnect Platform - Role & Permission Matrix

## User Roles

### 1. Super Admin
**Purpose:** Platform administrator, manages companies and subscription

**Permissions:**
| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Companies | ✅ | ✅ | ✅ | ✅ |
| Company Users | ✅ | ✅ | ✅ | ✅ |
| Subscriptions | ✅ | ✅ | ✅ | ✅ |
| Billing | ✅ | ✅ | ✅ | ❌ |
| System Logs | ❌ | ✅ | ❌ | ❌ |
| Reports | ✅ | ✅ | ✅ | ✅ |

**Features:**
- Create and approve companies
- Manage subscriptions and billing
- View platform analytics
- System configuration

---

### 2. Company Admin
**Purpose:** Company owner/manager, manages distributors, salesmen, products

**Permissions:**
| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Company Info | ❌ | ✅ | ✅ | ❌ |
| Distributors | ✅ | ✅ | ✅ | ✅ |
| Salesmen | ✅ | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ✅ | ✅ |
| Territories | ✅ | ✅ | ✅ | ✅ |
| Stories/Ads | ✅ | ✅ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ❌ | ❌ |
| Retailers | ❌ | ✅ | ❌ | ❌ |
| Orders | ❌ | ✅ | ❌ | ❌ |

**Multi-Tenant Isolation:** Only sees own company data

**Features:**
- Recruit distributors and salesmen
- Create and manage products
- Define territories
- Launch stories and promotions
- View comprehensive analytics
- Monitor field activities
- Sample request approvals
- Incentive management

---

### 3. Distributor Admin
**Purpose:** Distributor owner/manager, manages retailers, inventory, orders, collections

**Permissions:**
| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Distributor Info | ❌ | ✅ | ✅ | ❌ |
| Retailers | ✅ | ✅ | ✅ | ✅ |
| Inventory | ✅ | ✅ | ✅ | ✅ |
| Orders | ❌ | ✅ | ✅ | ❌ |
| Collections | ✅ | ✅ | ✅ | ❌ |
| Invoices | ✅ | ✅ | ❌ | ❌ |
| Payments | ❌ | ✅ | ✅ | ❌ |
| Staff | ✅ | ✅ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ❌ | ❌ |

**Multi-Tenant Isolation:** Only sees own distributor and associated retailers

**Features:**
- Approve retailers
- Manage inventory levels
- Process orders
- Record collections
- Generate invoices
- Track payments
- Manage warehouse staff
- Monitor performance metrics

---

### 4. Distributor Staff
**Purpose:** Distributor employee (warehouse, sales coordinator)

**Permissions:**
| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Retailers | ❌ | ✅ | ✅ | ❌ |
| Inventory | ✅ | ✅ | ✅ | ❌ |
| Orders | ❌ | ✅ | ✅ | ❌ |
| Collections | ✅ | ✅ | ✅ | ❌ |
| Invoices | ✅ | ✅ | ❌ | ❌ |

**Multi-Tenant Isolation:** Only sees own distributor data

**Features:**
- Process retailer orders
- Update inventory
- Record collections
- Generate invoices
- View order history

---

### 5. Salesman
**Purpose:** Field sales representative

**Permissions:**
| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Retailers (Assigned) | ✅ | ✅ | ✅ | ❌ |
| Visits | ✅ | ✅ | ✅ | ❌ |
| Orders | ✅ | ✅ | ✅ | ❌ |
| Follow-Ups | ✅ | ✅ | ✅ | ✅ |
| Samples | ✅ | ✅ | ❌ | ❌ |
| Competitor Reports | ✅ | ✅ | ✅ | ❌ |
| Retailer Feedback | ✅ | ✅ | ✅ | ❌ |
| Dashboard | ❌ | ✅ | ❌ | ❌ |

**Multi-Tenant Isolation:** Only sees assigned retailers and territory data

**Features:**
- Record daily visits with GPS
- Create orders (verified by retailer)
- Submit sample requests
- Track competitor activities
- Collect retailer feedback
- Monitor personal performance
- Submit follow-up tasks
- Onboard new retailers

---

### 6. Retailer
**Purpose:** Shop owner/manager

**Permissions:**
| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Shop Info | ❌ | ✅ | ✅ | ❌ |
| Orders | ✅ | ✅ | ✅ | ✅ |
| Invoices | ❌ | ✅ | ❌ | ❌ |
| Payments | ✅ | ✅ | ❌ | ❌ |
| Products | ❌ | ✅ | ❌ | ❌ |
| Stories | ❌ | ✅ | ❌ | ❌ |
| Reviews | ✅ | ✅ | ✅ | ✅ |
| Samples | ✅ | ✅ | ❌ | ❌ |
| Notifications | ❌ | ✅ | ✅ | ❌ |

**Multi-Tenant Isolation:** Only sees own shop and connected distributors/companies

**Features:**
- Place orders (direct or verify salesman orders)
- Browse product catalog
- View order history
- Check outstanding balance
- Download invoices
- Submit sample requests
- Write product reviews
- Track order delivery
- Receive notifications

---

## Access Control Matrix

### By Operation

| Operation | Super Admin | Company Admin | Distributor Admin | Distributor Staff | Salesman | Retailer |
|-----------|------------|---------------|-------------------|------------------|----------|----------|
| Register Company | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve Company | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Distributor | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Distributor | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Salesman | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Salesman | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Product | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Territory | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Record Visit | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Create Order | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Verify Order | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Record Collection | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Approve Retailer | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Create Story | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Story | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Data Visibility

### Company Admin
- ✅ Sees all distributors in their company
- ✅ Sees all salesmen in their company
- ✅ Sees all retailers connected to their company
- ✅ Sees all products (own)
- ✅ Sees all orders (own company)
- ❌ Cannot see other companies' data

### Distributor Admin
- ✅ Sees all retailers connected to them
- ✅ Sees all orders from their retailers
- ✅ Sees all collections from their retailers
- ✅ Sees own inventory
- ✅ Sees own staff
- ❌ Cannot see other distributors' data
- ❌ Cannot see salesmen (except those assigned)

### Salesman
- ✅ Sees assigned retailers only
- ✅ Sees own visits
- ✅ Sees own orders
- ✅ Sees own performance
- ❌ Cannot see other salesmen's data
- ❌ Cannot see retailers not assigned

### Retailer
- ✅ Sees own orders
- ✅ Sees own invoices
- ✅ Sees product catalog (from connected companies)
- ✅ Sees own outstanding balance
- ✅ Sees story feed
- ❌ Cannot see other retailers' data
- ❌ Cannot see financial details of other retailers

---

## Feature Flags by Role

| Feature | Super Admin | Company Admin | Distributor Admin | Salesman | Retailer |
|---------|------------|---------------|-------------------|----------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| User Management | ✅ | ✅ | ✅ | ❌ | ❌ |
| Inventory Management | ❌ | ✅ | ✅ | ❌ | ❌ |
| Order Management | ❌ | ✅ | ✅ | ✅ | ✅ |
| Collection Tracking | ❌ | ✅ | ✅ | ❌ | ❌ |
| Retailer Management | ❌ | ✅ | ✅ | ❌ | ❌ |
| Territory Management | ❌ | ✅ | ❌ | ❌ | ❌ |
| Visit Tracking | ❌ | ✅ | ❌ | ✅ | ❌ |
| Performance Analytics | ✅ | ✅ | ✅ | ✅ | ❌ |
| Story Management | ❌ | ✅ | ❌ | ❌ | ❌ |
| Competitor Tracking | ❌ | ✅ | ❌ | ✅ | ❌ |
| Incentive Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Reports | ✅ | ✅ | ✅ | ✅ | ❌ |
| Product Catalog | ❌ | ✅ | ❌ | ❌ | ✅ |

---

## API Authorization Pattern

```javascript
// Example middleware
async function checkPermission(requiredRole, resource, action) {
  // 1. Verify JWT token
  const token = req.headers.authorization;
  const user = verifyToken(token);
  
  // 2. Check role
  if (!hasRole(user.role, requiredRole)) {
    return res.status(403).json({error: "Forbidden"});
  }
  
  // 3. Check multi-tenancy
  if (user.tenantId !== data.tenantId) {
    return res.status(403).json({error: "Access Denied"});
  }
  
  // 4. Check resource permission
  if (!canAccess(user.role, resource, action)) {
    return res.status(403).json({error: "Permission Denied"});
  }
  
  return next();
}
```

---

## Audit Logging

All operations logged with:
- User ID
- Role
- Action (Create, Read, Update, Delete)
- Resource
- Timestamp
- IP Address
- Status (Success/Failure)

**Retention:** 12 months

---

## Security Policies

1. **Password:** Minimum 8 characters, strong encryption (bcrypt)
2. **Token Expiry:** 15 minutes (access), 7 days (refresh)
3. **Rate Limiting:** 100 requests/minute per user
4. **CORS:** Configured for authorized domains only
5. **HTTPS:** Required on production
6. **Data Encryption:** AES-256 for sensitive data
7. **Audit Trail:** All operations logged

