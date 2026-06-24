# B2BConnect Platform - Database ER Diagram & Collections Design

## Entity Relationship Diagram (ASCII)

```
┌─────────────────┐
│   SuperAdmin    │
└────────┬────────┘
         │
         ├─────────────────┬────────────────────┬──────────────────┐
         │                 │                    │                  │
    ┌────▼────┐      ┌─────▼──────┐      ┌────▼─────┐      ┌────▼────┐
    │ Company  │      │ Distributor│      │ Salesman │      │ Retailer │
    └────┬─────┘      └─────┬──────┘      └────┬─────┘      └────┬─────┘
         │                  │                   │                 │
         │                  │                   └────────┬────────┘
         │                  │                            │
         ├──────────────┐   │           ┌────────────────┼────────────┐
         │              │   │           │                │            │
    ┌────▼────┐    ┌───▼──┴──┐    ┌───▼──┐        ┌────▼─────┐  ┌───▼───┐
    │ Products │    │  Orders  │    │ Visits       │ Orders   │  │Reviews│
    └──────────┘    └──────────┘    └──────┘       └──────────┘  └───────┘
         │
    ┌────▼───────┐
    │  Inventory │
    └────────────┘

    ┌──────────────────┐
    │  Notifications   │
    └──────────────────┘

    ┌──────────────────┐
    │   Story Feed     │
    └──────────────────┘

    ┌──────────────────┐
    │   Samples        │
    └──────────────────┘

    ┌──────────────────┐
    │   Territories    │
    └──────────────────┘

    ┌──────────────────┐
    │   Collections    │
    └──────────────────┘
```

---

## MongoDB Collections Design

### 1. **User Collection**
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: Enum ['super-admin', 'company-admin', 'distributor-admin', 'distributor-staff', 'salesman', 'retailer'],
  profilePicture: String (URL),
  
  // Role-specific fields
  company: ObjectId (Company),
  distributor: ObjectId (Distributor),
  salesman: ObjectId (Salesman),
  retailer: ObjectId (Retailer),
  
  // Account status
  status: Enum ['active', 'inactive', 'suspended', 'pending-verification'],
  emailVerified: Boolean,
  phoneVerified: Boolean,
  
  // Settings
  notifications: {
    email: Boolean,
    sms: Boolean,
    push: Boolean
  },
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  
  // Indexes
  indexes: [
    {tenantId: 1, email: 1},
    {role: 1, status: 1}
  ]
}
```

### 2. **Company Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  businessType: Enum ['manufacturer', 'distributor', 'trader'],
  gstin: String,
  registrationNumber: String,
  
  // Contact Info
  email: String,
  phone: String,
  website: String,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    coordinates: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  },
  
  // Subscription
  subscriptionPlan: Enum ['starter', 'professional', 'enterprise'],
  subscriptionStatus: Enum ['active', 'expired', 'cancelled'],
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  maxDistributors: Number,
  maxSalesemen: Number,
  
  // Features enabled
  modules: {
    productManagement: Boolean,
    distributorNetwork: Boolean,
    salesforceAutomation: Boolean,
    retailerApp: Boolean,
    storyFeed: Boolean,
    analytics: Boolean,
    inventory: Boolean
  },
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId (User),
  
  // Indexes
  indexes: [
    {email: 1},
    {name: 1},
    {status: 1}
  ]
}
```

### 3. **Distributor Collection**
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  
  // Basic Info
  name: String,
  ownerName: String,
  email: String,
  phone: String,
  businessRegistration: String,
  gstin: String,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    coordinates: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  },
  
  // Coverage Territory
  territories: [ObjectId (Territory)],
  serviceCities: [String],
  
  // Relationships
  company: ObjectId (Company),
  manager: ObjectId (User),
  staff: [ObjectId (User)],
  
  // Status
  status: Enum ['active', 'inactive', 'pending-approval', 'rejected'],
  verificationStatus: Enum ['unverified', 'verified', 'approved'],
  
  // Credit & Performance
  creditLimit: Number,
  creditAvailable: Number,
  paymentTerms: Number, // days
  averagePaymentDays: Number,
  
  // Stats
  totalRetailers: Number,
  totalOrders: Number,
  totalRevenue: Number,
  orderFulfillmentRate: Number,
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  approvalDate: Date,
  
  // Indexes
  indexes: [
    {tenantId: 1, status: 1},
    {territories: 1},
    {address.coordinates: '2dsphere'}
  ]
}
```

### 4. **Salesman Collection**
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  
  // Personal Info
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  employeeId: String (unique),
  profilePicture: String,
  
  // Employment
  company: ObjectId (Company),
  distributors: [ObjectId (Distributor)],
  manager: ObjectId (User),
  joiningDate: Date,
  
  // Territory Assignment
  territories: [ObjectId (Territory)],
  assignedRetailers: [ObjectId (Retailer)],
  
  // Performance
  dailyVisitTarget: Number (default: 20),
  monthlyOrderTarget: Number (default: 40),
  totalVisits: Number,
  totalOrders: Number,
  totalRevenue: Number,
  retailersAdded: Number,
  performanceScore: Number (0-100),
  
  // Status
  status: Enum ['active', 'inactive', 'on-leave', 'terminated'],
  verificationStatus: Enum ['unverified', 'verified', 'approved'],
  
  // Compensation
  baseSalary: Number,
  incentiveStructure: {
    salesRevenue: {target: Number, rate: Number},
    retailersAdded: {target: Number, rate: Number},
    orderCompliance: {target: Number, rate: Number}
  },
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  lastActive: Date,
  
  // Indexes
  indexes: [
    {tenantId: 1, email: 1},
    {tenantId: 1, territories: 1},
    {tenantId: 1, status: 1}
  ]
}
```

### 5. **Retailer Collection**
```javascript
{
  _id: ObjectId,
  
  // Shop Info
  shopName: String,
  ownerName: String,
  email: String,
  phone: String,
  gstin: String (optional),
  registrationNumber: String,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    coordinates: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  },
  
  // Multi-Company Support
  companies: [
    {
      company: ObjectId (Company),
      distributor: ObjectId (Distributor),
      joinDate: Date,
      status: Enum ['active', 'inactive']
    }
  ],
  
  // Relationships
  primaryDistributor: ObjectId (Distributor),
  assignedSalesmen: [ObjectId (Salesman)],
  
  // Business Info
  shopType: Enum ['super-market', 'general-store', 'specialty-store', 'kiosk'],
  businessCategory: [String], // ['soap', 'beverage', etc]
  storeSize: Enum ['small', 'medium', 'large'],
  
  // Account Status
  status: Enum ['active', 'inactive', 'pending-approval', 'rejected'],
  verificationStatus: Enum ['unverified', 'verified', 'approved'],
  approvalDate: Date,
  
  // Credit Profile
  creditLimit: Number,
  creditAvailable: Number,
  outstandingBalance: Number,
  creditTerms: Number, // days
  averagePaymentDays: Number,
  paymentScore: Number (0-100),
  
  // Performance
  totalOrders: Number,
  totalRevenue: Number,
  lastOrderDate: Date,
  averageOrderValue: Number,
  retailerPotentialScore: Number (0-100), // Calculated
  
  // Preferences
  preferredPaymentMode: Enum ['cash', 'cheque', 'bank-transfer', 'digital'],
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    {address.coordinates: '2dsphere'},
    {companies.company: 1},
    {status: 1}
  ]
}
```

### 6. **Territory Collection**
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  
  // Geographic Info
  name: String,
  country: String,
  state: String,
  city: String,
  region: String,
  districts: [String],
  pincodes: [String],
  
  // Boundaries (GeoJSON)
  boundaries: {
    type: 'Polygon',
    coordinates: [...]
  },
  
  // Assignment
  assignedDistributors: [ObjectId (Distributor)],
  assignedSalesmen: [ObjectId (Salesman)],
  
  // Potential
  estimatedRetailers: Number,
  estimatedMonthlyGMV: Number,
  marketMaturity: Enum ['new', 'emerging', 'mature', 'saturated'],
  
  // Performance
  activeRetailers: Number,
  monthlyOrders: Number,
  monthlyRevenue: Number,
  
  // Status
  status: Enum ['active', 'inactive', 'planned'],
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    {tenantId: 1, city: 1},
    {boundaries: '2dsphere'}
  ]
}
```

### 7. **Order Collection**
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  
  // Order Info
  orderId: String (unique),
  orderType: Enum ['direct', 'salesman-assisted'],
  orderDate: Date,
  
  // Participants
  retailer: ObjectId (Retailer),
  distributor: ObjectId (Distributor),
  company: ObjectId (Company),
  createdBy: {
    type: Enum ['retailer', 'salesman'],
    userId: ObjectId (User)
  },
  
  // Items
  items: [
    {
      product: ObjectId (Product),
      quantity: Number,
      unitPrice: Number,
      discount: Number,
      total: Number // Calculated
    }
  ],
  
  // Calculations
  subtotal: Number,
  gst: Number (18%),
  total: Number,
  
  // Order Status
  status: Enum ['draft', 'submitted', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'],
  paymentStatus: Enum ['pending', 'partial', 'paid'],
  
  // Verification (for salesman orders)
  requiresRetailerVerification: Boolean,
  verificationStatus: Enum ['pending', 'approved', 'rejected'],
  verificationDate: Date,
  verificationNotes: String,
  
  // Delivery
  deliveryAddress: String,
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  deliveryTrackingId: String,
  
  // Payment
  paymentMode: Enum ['cash', 'cheque', 'bank-transfer', 'digital', 'credit'],
  paymentDate: Date,
  
  // Links
  invoiceId: ObjectId,
  sampleOrderId: ObjectId,
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    {tenantId: 1, orderId: 1},
    {retailer: 1, orderDate: -1},
    {distributor: 1, status: 1},
    {orderDate: -1}
  ]
}
```

### 8. **Product Collection**
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  
  // Product Info
  name: String,
  sku: String (unique),
  description: String,
  category: String,
  subcategory: String,
  
  // Media
  images: [String], // URLs
  videos: [String], // URLs
  datasheet: String, // URL
  
  // Pricing & Inventory
  basePrice: Number,
  hsnCode: String,
  gst: Number (default: 18),
  
  // Variants
  variants: [
    {
      size: String,
      unit: String,
      quantity: Number,
      price: Number
    }
  ],
  
  // Supply Chain
  manufacturer: ObjectId (Company),
  distributorPricing: [
    {
      distributor: ObjectId (Distributor),
      price: Number,
      discount: Number,
      minOrderQuantity: Number
    }
  ],
  
  // Status
  status: Enum ['draft', 'active', 'discontinued'],
  launchDate: Date,
  
  // Performance
  totalSold: Number,
  averageRating: Number,
  reviewCount: Number,
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    {tenantId: 1, sku: 1},
    {tenantId: 1, category: 1},
    {tenantId: 1, status: 1}
  ]
}
```

### 9. **Inventory Collection**
```javascript
{
  _id: ObjectId,
  distributor: ObjectId (Distributor),
  
  // Product Reference
  product: ObjectId (Product),
  variant: String, // Size/unit
  
  // Stock Levels
  currentStock: Number,
  minimumStock: Number,
  maximumStock: Number,
  reorderPoint: Number,
  
  // Cost
  costPrice: Number,
  sellingPrice: Number,
  
  // Movement
  lastRestockDate: Date,
  lastSaleDate: Date,
  monthlyConsumption: Number,
  
  // Status
  status: Enum ['in-stock', 'low-stock', 'out-of-stock'],
  
  // Audit
  updatedAt: Date,
  
  // Indexes
  indexes: [
    {distributor: 1, product: 1},
    {status: 1},
    {lastSaleDate: -1}
  ]
}
```

### 10. **StoryFeed Collection**
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  
  // Content
  title: String,
  description: String,
  contentType: Enum ['image', 'video', 'text', 'product-launch'],
  media: {
    url: String,
    duration: Number, // seconds
    thumbnail: String
  },
  
  // Targeting
  visibility: Enum ['all', 'distributors', 'salesmen', 'retailers'],
  targetTerritories: [ObjectId (Territory)],
  targetDistributors: [ObjectId (Distributor)],
  
  // Metadata
  tags: [String],
  relatedProducts: [ObjectId (Product)],
  
  // Performance
  views: Number,
  clicks: Number,
  shares: Number,
  conversions: Number,
  
  // Publishing
  status: Enum ['draft', 'published', 'archived'],
  publishDate: Date,
  expiryDate: Date,
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId (User),
  
  // Indexes
  indexes: [
    {tenantId: 1, status: 1},
    {publishDate: -1}
  ]
}
```

### 11. **Notification Collection**
```javascript
{
  _id: ObjectId,
  recipientId: ObjectId (User),
  
  // Notification Content
  title: String,
  message: String,
  type: Enum ['order', 'performance', 'alert', 'approval', 'system'],
  actionUrl: String,
  
  // Status
  status: Enum ['unread', 'read', 'archived'],
  readAt: Date,
  
  // Delivery
  channels: {
    inApp: Boolean,
    email: Boolean,
    sms: Boolean,
    push: Boolean
  },
  
  // Audit
  createdAt: Date,
  
  // Indexes
  indexes: [
    {recipientId: 1, createdAt: -1},
    {recipientId: 1, status: 1}
  ]
}
```

### 12. **Visit Collection** (Salesman)
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  
  // Visit Info
  salesman: ObjectId (Salesman),
  retailer: ObjectId (Retailer),
  distributor: ObjectId (Distributor),
  visitDate: Date,
  
  // Time Tracking
  checkInTime: Date,
  checkOutTime: Date,
  durationMinutes: Number, // Calculated
  
  // Location
  geoLocation: {
    type: 'Point',
    coordinates: [longitude, latitude],
    accuracy: Number
  },
  
  // Visit Details
  purpose: Enum ['order-collection', 'product-demo', 'feedback', 'retailer-onboarding', 'stock-check'],
  discussionNotes: String,
  productsShown: [ObjectId (Product)],
  
  // Outcome
  visitOutcome: Enum ['completed', 'pending', 'cancelled'],
  orderGenerated: ObjectId (Order),
  
  // Competitor Intelligence
  competitorProducts: [
    {
      brand: String,
      product: String,
      price: Number,
      feedback: String
    }
  ],
  
  // Photos
  photos: [String], // URLs
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    {tenantId: 1, salesman: 1, visitDate: -1},
    {retailer: 1, visitDate: -1},
    {visitDate: 1}
  ]
}
```

### 13. **SampleRequest Collection**
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  
  // Request Info
  requestId: String (unique),
  product: ObjectId (Product),
  requester: ObjectId (User), // Retailer or Salesman
  
  // Request Details
  quantity: Number,
  purpose: String,
  
  // Approval Chain
  status: Enum ['requested', 'approved', 'rejected', 'fulfilled', 'converted'],
  approvalDate: Date,
  approvalNotes: String,
  
  // Fulfillment
  distributor: ObjectId (Distributor),
  shipmentDate: Date,
  deliveryDate: Date,
  trackingId: String,
  
  // Conversion
  linkedOrder: ObjectId (Order),
  conversionDate: Date,
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    {tenantId: 1, status: 1},
    {product: 1},
    {requester: 1}
  ]
}
```

### 14. **CollectionRecord Collection**
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (Company),
  
  // Collection Info
  collectionId: String (unique),
  retailer: ObjectId (Retailer),
  distributor: ObjectId (Distributor),
  collectionDate: Date,
  
  // Payment
  amountCollected: Number,
  paymentMode: Enum ['cash', 'cheque', 'bank-transfer', 'digital'],
  referenceId: String, // Cheque/transaction number
  
  // Outstanding Balance
  balanceBefore: Number,
  balanceAfter: Number,
  
  // Collector
  collectedBy: ObjectId (User), // Distributor staff or salesman
  
  // Reconciliation
  status: Enum ['recorded', 'verified', 'reconciled'],
  verificationDate: Date,
  
  // Audit
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    {tenantId: 1, retailer: 1, collectionDate: -1},
    {distributor: 1, status: 1}
  ]
}
```

---

## Relationship Summary

| Collection | References | Relationship |
|-----------|-----------|--------------|
| Company | - | Root entity |
| Distributor | Company | Many-to-One |
| Salesman | Company, Distributor | Many-to-One |
| Retailer | Company (multi), Distributor | Many-to-One |
| Territory | Company, Distributor, Salesman | One-to-Many |
| Product | Company | Many-to-One |
| Inventory | Distributor, Product | Many-to-One |
| Order | Retailer, Distributor, Company | Many-to-One |
| StoryFeed | Company | Many-to-One |
| Notification | User | Many-to-One |
| Visit | Salesman, Retailer, Distributor | Many-to-One |
| SampleRequest | Product, User | Many-to-One |
| CollectionRecord | Retailer, Distributor | Many-to-One |

---

## Indexing Strategy

### Critical Indexes
- `{tenantId: 1, status: 1}` - Multi-tenant filtering
- `{coordinates: '2dsphere'}` - Geographic queries
- `{createdAt: -1}` - Timeline queries
- `{email: 1}` - User lookups

### Performance Indexes
- Compound indexes for common filter combinations
- Sorted indexes on frequently sorted fields
- Unique indexes on unique fields

