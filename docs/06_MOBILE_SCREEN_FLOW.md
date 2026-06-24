# B2BConnect Platform - Mobile Screen Flow & UI/UX Guide

## Navigation Architecture

### Company App (Web + Mobile)

```
Login/Register
├── Dashboard
│   ├── KPI Cards (Orders, Revenue, Retailers, Active Salesmen)
│   ├── Recent Orders List
│   └── Quick Actions (Create Distributor, Create Salesman, Create Product)
├── Products
│   ├── Product List (with filters, search)
│   ├── Create/Edit Product
│   ├── Product Variants
│   └── Product Analytics (sales, views, ratings)
├── Distributors
│   ├── Active Distributors
│   ├── Pending Approvals
│   ├── Distributor Details
│   │   ├── Performance Metrics
│   │   ├── Connected Retailers
│   │   └── Recent Orders
│   └── Invite Distributor
├── Salesmen
│   ├── Active Salesmen
│   ├── Pending Approvals
│   ├── Salesman Details
│   │   ├── Visit History
│   │   ├── Performance Score
│   │   ├── Assigned Retailers
│   │   └── Incentive Details
│   └── Invite Salesman
├── Territories
│   ├── Territory Map
│   ├── Create Territory
│   ├── Assign Distributors
│   └── Assign Salesmen
├── Stories/Ads
│   ├── Story Feed
│   ├── Create Story
│   ├── Schedule Post
│   └── Story Analytics (views, clicks, conversions)
├── Samples
│   ├── Pending Requests
│   ├── Approved Samples
│   └── Sample Fulfillment Tracking
├── Orders
│   ├── All Orders (filters, search)
│   ├── Order Status (pie chart)
│   ├── Order Details
│   └── Export Report
├── Analytics
│   ├── Dashboard (line charts, bar graphs)
│   ├── Orders Analytics
│   ├── Revenue Analytics
│   ├── Retailer Analytics
│   ├── Salesman Performance
│   └── Territory Performance
├── Settings
│   ├── Company Profile
│   ├── Subscription
│   ├── Team Members
│   ├── Notifications
│   └── Logout
└── Notifications
    ├── Bell Icon (badge count)
    ├── Notification List
    └── Mark as Read
```

### Distributor App (Web + Mobile)

```
Login/Register
├── Dashboard
│   ├── KPI Cards (Today Orders, Pending Collections, Inventory Alerts)
│   ├── Recent Orders
│   ├── Top Retailers
│   ├── Collection Reminders
│   └── Inventory Stock Alerts
├── Retailers
│   ├── Connected Retailers
│   ├── Pending Approvals
│   ├── Retailer Details
│   │   ├── Contact Info
│   │   ├── Order History
│   │   ├── Outstanding Balance
│   │   ├── Credit Limit & Available
│   │   └── Last Visit (by salesman)
│   ├── Approve Retailer
│   └── Add Retailer Manually
├── Orders
│   ├── Today's Orders
│   ├── All Orders (filters: status, date range)
│   ├── Order Details
│   │   ├── Items List
│   │   ├── Total Amount
│   │   ├── Status Timeline
│   │   ├── Delivery Tracking
│   │   └── Print Invoice
│   ├── Update Status (Accepted → Packed → Shipped → Delivered)
│   └── Export Report
├── Inventory
│   ├── Stock Levels (grid view)
│   ├── Low Stock Alerts
│   ├── Reorder Points
│   ├── Update Stock
│   ├── Stock History
│   └── Inventory Reports
├── Pricing & Discounts
│   ├── Product Pricing
│   ├── Retailer-Specific Pricing
│   ├── Promotional Discounts
│   ├── Create Discount Campaign
│   └── Discount History
├── Collections
│   ├── Pending Collections
│   ├── Record Collection
│   │   ├── Select Retailer
│   │   ├── Amount Collected
│   │   ├── Payment Mode (Cash, Cheque, Bank Transfer)
│   │   └── Reference/Cheque Number
│   ├── Collection History
│   ├── Collection Reports
│   └── Reconciliation
├── Invoices
│   ├── Recent Invoices
│   ├── Generate Invoice
│   ├── Print/Email Invoice
│   └── Invoice Reports
├── Payments
│   ├── Payment Tracking
│   ├── Record Payment (company → distributor)
│   ├── Payment History
│   └── Reconciliation
├── Staff Management
│   ├── Warehouse Staff
│   ├── Sales Coordinators
│   ├── Add Staff Member
│   ├── Assign Roles
│   └── Activity Log
├── Analytics
│   ├── Sales Dashboard
│   ├── Retailer Performance
│   ├── Inventory Turnover
│   ├── Collection Rate
│   └── Export Reports
├── Settings
│   ├── Distributor Profile
│   ├── Banking Details
│   ├── Notification Preferences
│   └── Logout
└── Notifications
    ├── Order Received
    ├── Payment Reminder
    ├── Low Stock Alert
    └── Collection Due
```

### Salesman App (Mobile Primary)

```
Login/Register
├── Dashboard (Home)
│   ├── Today's KPI
│   │   ├── Target Visits (5)
│   │   ├── Completed Visits (3)
│   │   ├── Pending Visits (2)
│   │   ├── Orders Generated (2)
│   │   └── Revenue Today (₹15,000)
│   ├── Quick Actions
│   │   ├── [Start Visit] → Record Visit form
│   │   ├── [Create Order] → Order entry form
│   │   ├── [Add Retailer] → Retailer registration form
│   │   └── [My Performance] → Performance dashboard
│   ├── Pending Follow-Ups
│   ├── Assigned Retailers (Quick access)
│   └── Performance Score (Monthly)
├── Retailers (My Assigned Retailers)
│   ├── Retailer List
│   │   ├── Store name, city
│   │   ├── Last visit date
│   │   ├── Outstanding balance
│   │   ├── Order count
│   │   └── Potential Score
│   ├── Retailer Details
│   │   ├── Contact Info
│   │   ├── Order History
│   │   ├── Visit History
│   │   ├── Outstanding Balance
│   │   ├── Payment Score
│   │   ├── Add Retailer Notes
│   │   └── [Action Buttons]
│   ├── Add New Retailer (Registration Form)
│   └── Retailer Search/Filter
├── Visits
│   ├── Today's Visits
│   ├── Visit History
│   ├── Record New Visit
│   │   ├── Select Retailer
│   │   ├── Check-In (GPS + Time)
│   │   ├── Purpose (dropdown)
│   │   ├── Discussion Notes
│   │   ├── Products Shown (select from catalog)
│   │   ├── Competitor Products (manual entry)
│   │   ├── Photos (camera)
│   │   ├── Follow-Up Date (optional)
│   │   ├── Check-Out (GPS + Time)
│   │   └── [Submit Visit]
│   └── Visit Map (GPS locations)
├── Orders
│   ├── Recent Orders
│   ├── Create Order
│   │   ├── Select Retailer
│   │   ├── Select Items (from company catalog)
│   │   ├── Quantity entry
│   │   ├── Auto-calculated prices
│   │   ├── Total with GST (auto)
│   │   ├── Payment Mode (select)
│   │   ├── Delivery Address (auto-filled)
│   │   ├── Send for Verification (Retailer Approval)
│   │   └── [Submit Order]
│   ├── Order History
│   └── Order Status Tracking
├── Samples
│   ├── Request Sample
│   │   ├── Select Product
│   │   ├── Quantity
│   │   ├── Purpose
│   │   └── [Submit Request]
│   ├── Sample Request History
│   └── Conversion Tracking (Sample → Order)
├── Follow-Ups
│   ├── Pending Follow-Ups (sorted by date)
│   ├── Create Follow-Up
│   │   ├── Select Retailer
│   │   ├── Reason (dropdown)
│   │   ├── Description
│   │   ├── Priority (Low/Medium/High)
│   │   └── [Schedule Follow-Up]
│   ├── Complete Follow-Up
│   │   ├── Completion Notes
│   │   ├── Outcome (dropdown)
│   │   ├── Next Follow-Up Date (optional)
│   │   └── [Mark Complete]
│   └── Follow-Up History
├── Competitor Tracking
│   ├── Report Competitor
│   │   ├── Select Retailer
│   │   ├── Competitor Brand
│   │   ├── Product Name
│   │   ├── Price
│   │   ├── Packaging
│   │   ├── Feedback
│   │   ├── Market Trend (Increasing/Stable/Decreasing)
│   │   ├── Photos
│   │   └── [Submit Report]
│   ├── Competitor Intelligence (summary)
│   └── Market Analysis (by region)
├── Product Presentation
│   ├── Product Catalog
│   │   ├── Product search
│   │   ├── Product details
│   │   ├── Product images
│   │   ├── Product videos (link)
│   │   └── Current stock (at distributor)
│   └── Share Product Link (WhatsApp, SMS)
├── Story Feed
│   ├── Company Updates
│   ├── Product Launches
│   ├── Promotional Offers
│   ├── Training Videos
│   └── View Story Details
├── Performance Dashboard
│   ├── Today's Performance
│   ├── Monthly Performance
│   │   ├── Visits (Target vs Actual)
│   │   ├── Orders (Target vs Actual)
│   │   ├── Revenue (Target vs Actual)
│   │   ├── Retailers Added
│   │   └── Performance Score
│   ├── Performance Trend (chart)
│   ├── Incentive Breakdown (by component)
│   └── Peer Comparison (anonymized)
├── Settings
│   ├── Personal Profile
│   ├── Territory
│   ├── Manager Contact
│   ├── Offline Mode (sync settings)
│   ├── Notification Preferences
│   └── Logout
└── Notifications
    ├── New Order
    ├── Retailer Verified Order
    ├── New Sample Approved
    ├── Follow-Up Reminder
    ├── Performance Alert
    └── Marketing Updates
```

### Retailer App (Mobile Primary)

```
Login/Register/Social Login
├── Home Dashboard
│   ├── Shop Info Card
│   │   ├── Shop Name
│   │   ├── Outstanding Balance
│   │   ├── Credit Limit & Available
│   │   └── Last Order Date
│   ├── Quick Stats
│   │   ├── Total Orders (lifetime)
│   │   ├── Total Spent
│   │   └── Avg Order Value
│   ├── Featured Products (from story feed)
│   └── [Browse Products] [My Orders] [Samples]
├── Product Discovery
│   ├── Product Search
│   │   ├── Category filter
│   │   ├── Brand filter
│   │   ├── Price range slider
│   │   └── Sort (Relevance, Price, Rating, New)
│   ├── Product Listing
│   │   ├── Product image, name, rating
│   │   ├── Price (from selected distributor)
│   │   ├── Stock availability
│   │   ├── [Add to Cart]
│   │   └── [View Details]
│   ├── Product Details
│   │   ├── Images gallery
│   │   ├── Product description
│   │   ├── Variants (sizes)
│   │   ├── Price & discount
│   │   ├── Stock availability
│   │   ├── Customer reviews & ratings
│   │   ├── Related products
│   │   └── [Add to Cart] / [Add to Wishlist]
│   ├── Product Videos
│   │   ├── Video list
│   │   ├── Play video
│   │   └── Share video
│   └── Product Recommendations (AI-driven)
├── Story Feed
│   ├── Story Timeline
│   │   ├── Company logo
│   │   ├── Story title
│   │   ├── Image/Video thumbnail
│   │   ├── Views count, click count
│   │   └── [View Story]
│   ├── Story Details
│   │   ├── Full image/video
│   │   ├── Title & description
│   │   ├── Related products (links)
│   │   ├── [View Related Products]
│   │   └── [Share on WhatsApp/Facebook]
│   └── Filter by Company/Category
├── Orders
│   ├── Create Order
│   │   ├── Select Distributor (or auto-selected)
│   │   ├── Shopping Cart
│   │   │   ├── Add Products (search or browse)
│   │   │   ├── Quantity per item
│   │   │   ├── Item subtotal
│   │   │   ├── Total before GST
│   │   │   ├── GST calculation (18%)
│   │   │   └── Grand Total
│   │   ├── Delivery Address
│   │   ├── Payment Mode
│   │   ├── Special Instructions
│   │   ├── Order Summary
│   │   └── [Confirm Order]
│   ├── Salesman Order Verification
│   │   ├── Notification: "Salesman [Name] placed order"
│   │   ├── Order Details
│   │   │   ├── Items list
│   │   │   ├── Total amount
│   │   │   └── Salesman name & ID
│   │   ├── [Approve] / [Reject]
│   │   └── [Request Changes]
│   ├── Order History
│   │   ├── All orders (with filters)
│   │   ├── Order status (Draft, Pending, Confirmed, Shipped, Delivered)
│   │   ├── Order details on tap
│   │   ├── Print/Download Invoice
│   │   └── Track Delivery
│   ├── Order Tracking
│   │   ├── Real-time status
│   │   ├── Estimated delivery date
│   │   ├── Delivery tracking ID (link to carrier)
│   │   └── [Contact Distributor]
│   └── Export Orders (PDF/CSV)
├── Invoices & Payments
│   ├── Invoice List
│   │   ├── Invoice number, date
│   │   ├── Amount
│   │   ├── Payment status
│   │   └── [View / Download / Pay]
│   ├── Invoice Details
│   │   ├── Invoice number
│   │   ├── Items with quantities
│   │   ├── Subtotal, GST, Total
│   │   ├── Payment status
│   │   ├── Due date
│   │   └── [Download PDF]
│   ├── Outstanding Balance
│   │   ├── Total due
│   │   ├── Due date
│   │   ├── Overdue amount
│   │   └── [Pay Now]
│   └── Payment History
├── Samples
│   ├── Request Sample
│   │   ├── Select Product
│   │   ├── Quantity
│   │   ├── Purpose
│   │   └── [Submit Request]
│   ├── Sample Status
│   │   ├── Pending requests
│   │   ├── Approved samples
│   │   ├── Fulfilled samples
│   │   └── Track delivery
│   └── Sample to Order Conversion (link)
├── Credit Information
│   ├── Credit Limit: ₹100,000
│   ├── Available Credit: ₹45,000
│   ├── Credit Used: ₹55,000
│   ├── Payment Terms: 30 days net
│   ├── Avg Payment Days: 25
│   ├── Credit Score: 78/100
│   └── Payment Reminders
├── Reviews & Ratings
│   ├── Rate Products
│   ├── Leave Reviews
│   ├── Photo upload (optional)
│   ├── Review History
│   └── View Others' Reviews
├── Account Management
│   ├── Shop Profile
│   ├── Contact Information
│   ├── Address Management
│   ├── Payment Methods
│   │   ├── Add Bank Account
│   │   ├── Add Card
│   │   └── Saved Methods
│   ├── Notification Preferences
│   └── Logout
└── Notifications
    ├── Order Confirmation
    ├── Order Shipped
    ├── Order Delivered
    ├── Payment Reminder
    ├── Promotional Offers
    ├── New Product Launch
    ├── Salesman Visit Notification
    └── System Notifications
```

---

## UI/UX Design Principles

### Color Scheme
- **Primary:** #667eea (Blue)
- **Secondary:** #764ba2 (Purple)
- **Accent:** #f39c12 (Orange)
- **Success:** #27ae60 (Green)
- **Warning:** #e74c3c (Red)
- **Background:** #f8f9fa (Light Gray)

### Typography
- **Headings:** 24px bold (H1), 20px bold (H2), 16px bold (H3)
- **Body:** 14px regular
- **Labels:** 12px regular
- **Font Family:** Segoe UI, Helvetica, Arial

### Component Library (Ionic)
- **Form Controls:** IonInput, IonSelect, IonToggle, IonCheckbox
- **Buttons:** IonButton with variants (solid, outline, clear)
- **Cards:** IonCard for data presentation
- **Lists:** IonList with IonItem components
- **Modals:** IonModal for dialogs
- **Popups:** IonToast for notifications
- **Tabs:** IonTabBar for navigation
- **Toolbar:** IonToolbar for header/footer

### Responsive Design
- **Mobile First:** Design for 375px width (iPhone SE)
- **Tablet:** Support 768px width (iPad)
- **Web:** Support 1024px+ width (Desktop)
- **Breakpoints:** xs(0-320), sm(320-640), md(640-1024), lg(1024+)

### Accessibility
- **WCAG 2.1 AA** compliance
- Minimum contrast ratio: 4.5:1 for text
- Touch targets: Minimum 44x44px
- Screen reader support
- Keyboard navigation

### Performance Targets
- **Mobile App Load:** <3 seconds
- **Web App Load:** <2 seconds
- **API Response:** <200ms (p95)
- **Animation:** 60 FPS

---

## Key Screens (Wireframes)

### Salesman Visit Entry Screen

```
┌─────────────────────────────────────────┐
│ Back    [Visit Recording]           ⊗   │
├─────────────────────────────────────────┤
│                                         │
│  📍 Current Location: Bangalore        │
│  ⏰ Check-in: 10:30 AM                 │
│                                         │
├─────────────────────────────────────────┤
│  Retailer                      [Dropdown]│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Sharma General Store                   │
│                                         │
│  Purpose                       [Dropdown]│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Order Collection                       │
│                                         │
│  Discussion Notes             [TextField]│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Discussed new product launch...        │
│                                         │
│  [📷 Add Photos]  [📹 Video]            │
│                                         │
├─────────────────────────────────────────┤
│  [Cancel]  [Save Draft]  [Complete]    │
└─────────────────────────────────────────┘
```

### Retailer Order Verification Screen

```
┌─────────────────────────────────────────┐
│ Back    [Order Verification]        ⊗   │
├─────────────────────────────────────────┤
│                                         │
│  ⏱️  Salesman Rahul placed order      │
│                                         │
│  Order #ORD-20260616-001               │
│  Status: Pending Your Approval         │
│                                         │
├─────────────────────────────────────────┤
│  Items:                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  □ Soap Bar (10 units)     ₹450       │
│  □ Detergent (5 units)     ₹250       │
│                                         │
│  Subtotal:                   ₹700      │
│  GST (18%):                  ₹126      │
│  ─────────────────────────────────    │
│  Total:                      ₹826      │
│                                         │
├─────────────────────────────────────────┤
│  [Reject]  [Request Changes]  [Approve]│
└─────────────────────────────────────────┘
```

### Company Dashboard Screen

```
┌─────────────────────────────────────────┐
│ ABC FMCG          [Settings] [Logout]  │
├─────────────────────────────────────────┤
│                                         │
│  📊 KPI Dashboard (Today)               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  ┌─────────────────┬──────────────────┐ │
│  │ 📦 Orders       │ 💰 Revenue       │ │
│  │ 245             │ ₹5,45,000        │ │
│  │ +12% vs Avg     │ +8% vs Avg       │ │
│  └─────────────────┴──────────────────┘ │
│  ┌─────────────────┬──────────────────┐ │
│  │ 🏪 Retailers    │ 👥 Salesmen      │ │
│  │ 12,450          │ 245              │ │
│  │ +450 this month │ +15 this month   │ │
│  └─────────────────┴──────────────────┘ │
│                                         │
│  Recent Orders                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  ORD-001: Sharma Store - ₹8,500        │
│  ORD-002: Patel Mart - ₹12,300         │
│  ORD-003: Kumar Store - ₹6,750         │
│                                         │
│  [View All] [Create Distributor] [⊕]  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Animation & Transitions

- **Page Load:** Fade-in (200ms)
- **Button Press:** Scale feedback (100ms)
- **List Items:** Slide-in from bottom (300ms staggered)
- **Form Errors:** Shake animation (400ms)
- **Success Toast:** Slide-down (300ms)

