# B2BConnect Platform - API Specification

## Base URL
```
Development: http://localhost:4000/api
Production: https://api.b2bconnect.com/api
```

## Authentication

All endpoints (except public ones) require:
```
Authorization: Bearer {accessToken}
X-Tenant-Id: {tenantId}
```

**Token Expiry:** 15 minutes  
**Refresh Token Expiry:** 7 days

---

## Core Endpoints

### Authentication & Authorization

#### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "securePassword123",
  "role": "retailer" | "salesman" | "distributor" | "company"
}

Response: 201 Created
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "role": "retailer",
    "status": "pending-verification"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### 2. Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "role": "retailer",
    "company": "507f1f77bcf86cd799439012"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### 3. Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "accessToken": "eyJhbGc..."
}
```

---

### Company APIs

#### 1. Create Company
```
POST /companies
Authorization: Bearer {superAdminToken}
Content-Type: application/json

{
  "name": "ABC FMCG",
  "businessType": "manufacturer",
  "email": "admin@abc.com",
  "phone": "+919876543210",
  "gstin": "18AABCT1234H1Z5",
  "address": {
    "street": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India"
  },
  "subscriptionPlan": "professional",
  "modules": {
    "productManagement": true,
    "distributorNetwork": true,
    "salesforceAutomation": true,
    "storyFeed": false
  }
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "ABC FMCG",
  "status": "active",
  "createdAt": "2026-06-16T10:00:00Z"
}
```

#### 2. Get Company Details
```
GET /companies/:id
Authorization: Bearer {token}
X-Tenant-Id: {tenantId}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "ABC FMCG",
  "email": "admin@abc.com",
  "phone": "+919876543210",
  "gstin": "18AABCT1234H1Z5",
  "subscriptionPlan": "professional",
  "subscriptionStatus": "active",
  "modules": {...},
  "totalDistributors": 45,
  "totalSalesmen": 250,
  "totalRetailers": 12000,
  "monthlyGMV": 50000000
}
```

#### 3. Update Company
```
PATCH /companies/:id
Authorization: Bearer {companyAdminToken}
X-Tenant-Id: {tenantId}
Content-Type: application/json

{
  "phone": "+919876543211",
  "address": {...}
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "ABC FMCG",
  "updatedAt": "2026-06-16T10:30:00Z"
}
```

---

### Distributor APIs

#### 1. Register as Distributor (Self-Registration)
```
POST /distributors/register
Content-Type: application/json

{
  "name": "XYZ Distribution",
  "ownerName": "Raj Kumar",
  "email": "raj@xyzdist.com",
  "phone": "+919876543210",
  "gstin": "18AABCT5678H1Z9",
  "businessRegistration": "REG123456",
  "address": {
    "street": "456 Park Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India",
    "coordinates": [77.5946, 12.9716]
  },
  "serviceCities": ["Bangalore", "Mysore"],
  "applyingToCompany": "507f1f77bcf86cd799439012"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "XYZ Distribution",
  "status": "pending-approval",
  "verificationStatus": "unverified",
  "createdAt": "2026-06-16T10:00:00Z"
}
```

#### 2. List Distributors (Company View)
```
GET /distributors?status=active&city=Bangalore&page=1&limit=20
Authorization: Bearer {companyAdminToken}
X-Tenant-Id: {tenantId}

Response: 200 OK
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "name": "XYZ Distribution",
      "city": "Bangalore",
      "totalRetailers": 245,
      "totalOrders": 1200,
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

#### 3. Approve Distributor Registration
```
POST /distributors/:id/approve
Authorization: Bearer {companyAdminToken}
X-Tenant-Id: {tenantId}
Content-Type: application/json

{
  "approvalNotes": "Verified and approved for Bangalore region"
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439020",
  "status": "active",
  "verificationStatus": "verified",
  "approvalDate": "2026-06-16T11:00:00Z"
}
```

#### 4. Get Distributor Dashboard
```
GET /distributors/:id/dashboard
Authorization: Bearer {distributorToken}
X-Tenant-Id: {tenantId}

Response: 200 OK
{
  "topMetrics": {
    "totalRetailers": 245,
    "pendingOrders": 12,
    "todayRevenue": 450000,
    "outstandingBalance": 2300000
  },
  "recentOrders": [...],
  "topRetailers": [...],
  "inventoryAlerts": [...],
  "paymentReminders": [...]
}
```

---

### Retailer APIs

#### 1. Register as Retailer
```
POST /retailers/register
Content-Type: application/json

{
  "shopName": "Sharma General Store",
  "ownerName": "Priya Sharma",
  "email": "priya@store.com",
  "phone": "+919876543210",
  "gstin": "18AABCS1234H1Z0",
  "shopType": "general-store",
  "businessCategory": ["soap", "beverage"],
  "storeSize": "medium",
  "address": {
    "street": "789 Market Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India",
    "coordinates": [77.5946, 12.9716]
  }
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439030",
  "shopName": "Sharma General Store",
  "status": "pending-approval",
  "verificationStatus": "unverified",
  "createdAt": "2026-06-16T10:00:00Z"
}
```

#### 2. Get Available Distributors (Auto-Matching)
```
GET /retailers/available-distributors?lat=12.9716&lon=77.5946&radius=5
Authorization: Bearer {retailerToken}

Response: 200 OK
{
  "distributors": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "name": "XYZ Distribution",
      "city": "Bangalore",
      "distance": 2.5,
      "availableProducts": 450,
      "minOrderValue": 10000,
      "status": "verified"
    },
    {
      "_id": "507f1f77bcf86cd799439021",
      "name": "ABC Distribution",
      "city": "Bangalore",
      "distance": 3.2,
      "availableProducts": 320,
      "minOrderValue": 5000,
      "status": "verified"
    }
  ]
}
```

#### 3. Select Distributor
```
POST /retailers/:id/select-distributor
Authorization: Bearer {retailerToken}
Content-Type: application/json

{
  "distributor": "507f1f77bcf86cd799439020",
  "company": "507f1f77bcf86cd799439012"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439030",
  "shopName": "Sharma General Store",
  "companies": [
    {
      "company": "507f1f77bcf86cd799439012",
      "distributor": "507f1f77bcf86cd799439020",
      "status": "pending-approval",
      "joinDate": "2026-06-16T10:00:00Z"
    }
  ],
  "status": "pending-approval"
}
```

#### 4. Get Retailer Dashboard
```
GET /retailers/dashboard
Authorization: Bearer {retailerToken}

Response: 200 OK
{
  "shopInfo": {
    "shopName": "Sharma General Store",
    "status": "active",
    "businessCategories": ["soap", "beverage"]
  },
  "topMetrics": {
    "totalOrders": 45,
    "totalSpent": 450000,
    "outstandingBalance": 45000,
    "creditLimit": 100000,
    "creditAvailable": 55000
  },
  "recentOrders": [...],
  "recommendations": [...],
  "notifications": [...]
}
```

---

### Product APIs

#### 1. Create Product (Company)
```
POST /products
Authorization: Bearer {companyAdminToken}
X-Tenant-Id: {tenantId}
Content-Type: application/json

{
  "name": "Premium Dish Soap",
  "sku": "SOAP-DS-001",
  "description": "Effective dish cleaning soap",
  "category": "Cleaning",
  "subcategory": "Dish Soap",
  "basePrice": 45,
  "hsnCode": "3401",
  "gst": 18,
  "variants": [
    {
      "size": "500ml",
      "unit": "bottle",
      "quantity": 1,
      "price": 45
    },
    {
      "size": "1L",
      "unit": "bottle",
      "quantity": 1,
      "price": 80
    }
  ],
  "images": ["https://..."],
  "launchDate": "2026-06-16"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439040",
  "name": "Premium Dish Soap",
  "sku": "SOAP-DS-001",
  "status": "active",
  "createdAt": "2026-06-16T10:00:00Z"
}
```

#### 2. Get Product Catalog (Retailer)
```
GET /products?category=Cleaning&limit=20&page=1&company=507f1f77bcf86cd799439012
Authorization: Bearer {token}

Response: 200 OK
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "name": "Premium Dish Soap",
      "sku": "SOAP-DS-001",
      "category": "Cleaning",
      "basePrice": 45,
      "variants": [...],
      "images": [...],
      "rating": 4.5,
      "reviews": 234,
      "stocks": {
        "distributor": "507f1f77bcf86cd799439020",
        "available": 500,
        "price": 40
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 450
  }
}
```

---

### Order APIs

#### 1. Create Direct Order (Retailer → Distributor)
```
POST /orders
Authorization: Bearer {retailerToken}
X-Tenant-Id: {tenantId}
Content-Type: application/json

{
  "retailer": "507f1f77bcf86cd799439030",
  "distributor": "507f1f77bcf86cd799439020",
  "company": "507f1f77bcf86cd799439012",
  "items": [
    {
      "product": "507f1f77bcf86cd799439040",
      "quantity": 10,
      "unitPrice": 40,
      "discount": 0
    }
  ],
  "paymentMode": "credit",
  "deliveryAddress": "789 Market Street, Bangalore"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439050",
  "orderId": "ORD-20260616-001",
  "orderType": "direct",
  "status": "confirmed",
  "subtotal": 400,
  "gst": 72,
  "total": 472,
  "createdAt": "2026-06-16T10:00:00Z"
}
```

#### 2. Create Salesman-Assisted Order
```
POST /orders/create-salesman-order
Authorization: Bearer {salesmanToken}
X-Tenant-Id: {tenantId}
Content-Type: application/json

{
  "retailer": "507f1f77bcf86cd799439030",
  "distributor": "507f1f77bcf86cd799439020",
  "company": "507f1f77bcf86cd799439012",
  "salesman": "507f1f77bcf86cd799439060",
  "items": [
    {
      "product": "507f1f77bcf86cd799439040",
      "quantity": 10,
      "unitPrice": 40
    }
  ],
  "requiresRetailerVerification": true
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439050",
  "orderId": "ORD-20260616-001",
  "orderType": "salesman-assisted",
  "status": "submitted",
  "verificationStatus": "pending",
  "createdBy": {
    "type": "salesman",
    "userId": "507f1f77bcf86cd799439060"
  },
  "total": 472,
  "requiresRetailerVerification": true
}
```

#### 3. Verify Salesman Order (Retailer)
```
PATCH /orders/:id/verify
Authorization: Bearer {retailerToken}
X-Tenant-Id: {tenantId}
Content-Type: application/json

{
  "action": "approve" | "reject",
  "notes": "Order approved"
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439050",
  "verificationStatus": "approved",
  "status": "confirmed",
  "verificationDate": "2026-06-16T10:15:00Z"
}
```

#### 4. Get Order Status
```
GET /orders/:id
Authorization: Bearer {token}
X-Tenant-Id: {tenantId}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439050",
  "orderId": "ORD-20260616-001",
  "status": "confirmed",
  "items": [...],
  "total": 472,
  "createdBy": {
    "type": "salesman",
    "user": {
      "_id": "507f1f77bcf86cd799439060",
      "firstName": "Rahul",
      "lastName": "Kumar"
    }
  },
  "deliveryTrackingId": "TRACK-001",
  "expectedDeliveryDate": "2026-06-18T00:00:00Z"
}
```

---

### Salesman APIs

#### 1. Register as Salesman
```
POST /salesmen/register
Content-Type: application/json

{
  "firstName": "Rahul",
  "lastName": "Kumar",
  "email": "rahul@sales.com",
  "phone": "+919876543210",
  "employeeId": "EMP-001",
  "baseSalary": 20000,
  "applyingToCompany": "507f1f77bcf86cd799439012"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439060",
  "firstName": "Rahul",
  "lastName": "Kumar",
  "email": "rahul@sales.com",
  "status": "pending-approval",
  "createdAt": "2026-06-16T10:00:00Z"
}
```

#### 2. Get Assigned Retailers (Salesman)
```
GET /salesmen/my-retailers
Authorization: Bearer {salesmanToken}
X-Tenant-Id: {tenantId}

Response: 200 OK
{
  "retailers": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "shopName": "Sharma General Store",
      "city": "Bangalore",
      "lastVisit": "2026-06-15T10:00:00Z",
      "outstandingBalance": 45000,
      "potentialScore": 78,
      "phone": "+919876543210"
    }
  ]
}
```

#### 3. Record Visit
```
POST /visits
Authorization: Bearer {salesmanToken}
X-Tenant-Id: {tenantId}
Content-Type: application/json

{
  "salesman": "507f1f77bcf86cd799439060",
  "retailer": "507f1f77bcf86cd799439030",
  "distributor": "507f1f77bcf86cd799439020",
  "visitDate": "2026-06-16",
  "checkInTime": "2026-06-16T10:00:00Z",
  "checkOutTime": "2026-06-16T10:30:00Z",
  "purpose": "order-collection",
  "discussionNotes": "Discussed new product launch",
  "geoLocation": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716],
    "accuracy": 10
  },
  "productsShown": ["507f1f77bcf86cd799439040"],
  "competitorProducts": [
    {
      "brand": "Competitor X",
      "product": "Dish Soap",
      "price": 35
    }
  ]
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439070",
  "visitDate": "2026-06-16",
  "checkInTime": "2026-06-16T10:00:00Z",
  "checkOutTime": "2026-06-16T10:30:00Z",
  "durationMinutes": 30,
  "status": "completed"
}
```

#### 4. Get Salesman Dashboard
```
GET /salesmen/dashboard
Authorization: Bearer {salesmanToken}
X-Tenant-Id: {tenantId}

Response: 200 OK
{
  "todayMetrics": {
    "targetVisits": 5,
    "completedVisits": 3,
    "ordersGenerated": 2,
    "revenueGenerated": 15000,
    "followUpsDue": 1
  },
  "monthlyMetrics": {
    "targetVisits": 100,
    "actualVisits": 65,
    "targetOrders": 40,
    "actualOrders": 28,
    "performanceScore": 72,
    "incentiveEarned": 8500
  },
  "topRetailers": [...],
  "pendingFollowUps": [...]
}
```

---

### Story Feed APIs

#### 1. Create Story (Company)
```
POST /stories
Authorization: Bearer {companyAdminToken}
X-Tenant-Id: {tenantId}
Content-Type: application/json

{
  "title": "New Product Launch: Premium Detergent",
  "description": "Launch of our new premium detergent line",
  "contentType": "video",
  "media": {
    "url": "https://...",
    "duration": 45
  },
  "visibility": "all",
  "tags": ["launch", "detergent", "premium"],
  "relatedProducts": ["507f1f77bcf86cd799439040"],
  "status": "published",
  "publishDate": "2026-06-16T10:00:00Z",
  "expiryDate": "2026-06-30T23:59:59Z"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439080",
  "title": "New Product Launch",
  "status": "published",
  "createdAt": "2026-06-16T10:00:00Z"
}
```

#### 2. Get Story Feed (Retailer)
```
GET /stories/feed?limit=10&page=1
Authorization: Bearer {retailerToken}

Response: 200 OK
{
  "stories": [
    {
      "_id": "507f1f77bcf86cd799439080",
      "title": "New Product Launch",
      "description": "Launch of our new premium detergent",
      "media": {...},
      "company": {
        "name": "ABC FMCG"
      },
      "relatedProducts": [...],
      "views": 1250,
      "clicks": 120,
      "conversions": 35
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid email format",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong",
  "statusCode": 500
}
```

---

## Rate Limiting

- **Default:** 100 requests/minute per user
- **Premium:** 1000 requests/minute
- **Headers:**
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1624070400
  ```

---

## Pagination

All list endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field (default: -createdAt)

Response format:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 450,
    "totalPages": 23
  }
}
```

---

## Webhooks (Phase 2)

Planned webhooks for real-time events:
- `order.created`
- `order.verified`
- `order.shipped`
- `payment.received`
- `story.published`
- `distributor.approved`
- `retailer.verified`

