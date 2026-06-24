# B2BConnect Salesman Module - Complete Implementation Guide

## 📋 Table of Contents
1. [Module Overview](#module-overview)
2. [Architecture](#architecture)
3. [Database Design](#database-design)
4. [API Endpoints](#api-endpoints)
5. [Frontend Components](#frontend-components)
6. [Mobile Components](#mobile-components)
7. [KPI Framework](#kpi-framework)
8. [Incentive Structure](#incentive-structure)
9. [Dashboard Designs](#dashboard-designs)
10. [Deployment Guide](#deployment-guide)

---

## Module Overview

### Purpose
The Salesman Module digitizes field force management for FMCG distribution companies, enabling:
- Complete visit tracking and management
- Retailer profiling and scoring
- Order collection through salesmen
- Market intelligence gathering
- Performance tracking and incentive management
- Real-time coverage monitoring

### Key Features
- **Optional Module**: Companies can enable/disable through settings
- **Multi-Tenant**: Full tenant isolation
- **Role-Based Access**: Company-Admin, Distributor-Admin, Salesman
- **Mobile-First**: Ionic app for field operations
- **Real-Time Tracking**: GPS location and check-in/check-out
- **Analytics**: Comprehensive dashboards and reporting

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    B2BConnect Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐  │
│  │  Web App     │      │  Mobile App  │      │  Admin   │  │
│  │  (Angular)   │      │  (Ionic)     │      │  Panel   │  │
│  └──────────────┘      └──────────────┘      └──────────┘  │
│         │                     │                     │        │
│         └─────────────────────┼─────────────────────┘        │
│                               │                              │
│                    ┌──────────▼──────────┐                  │
│                    │   API Gateway       │                  │
│                    │   (Express.js)      │                  │
│                    └──────────┬──────────┘                  │
│                               │                              │
│         ┌─────────────────────┼─────────────────────┐       │
│         │                     │                     │       │
│  ┌──────▼──────┐     ┌────────▼────────┐    ┌──────▼────┐ │
│  │  Salesmen   │     │  Visit Routes   │    │  Reports  │ │
│  │  Routes     │     │                 │    │  Routes   │ │
│  └──────▬──────┘     └────────┬────────┘    └──────┬────┘ │
│         │                     │                     │       │
│         └─────────────────────┼─────────────────────┘       │
│                               │                              │
│                    ┌──────────▼──────────┐                  │
│                    │  MongoDB Database   │                  │
│                    │  (11 Collections)   │                  │
│                    └─────────────────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose ODM
- RESTful API architecture
- JWT authentication
- Multi-tenant architecture

**Frontend**
- Angular 22 (Web)
- Ionic 8 + Capacitor (Mobile)
- RxJS for reactive state management
- Standalone components pattern

---

## Database Design

### Collections Overview

#### 1. **Salesman** (sales_personnel.js)
```json
{
  "tenantId": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "phone": "string",
  "employeeId": "string (unique)",
  "territory": "string",
  "assignedDistributors": ["ObjectId"],
  "assignedRetailers": ["ObjectId"],
  "productCategories": ["string"],
  "dailyVisitTarget": "number (default: 20)",
  "status": "enum: active|inactive|on-leave",
  "manager": "ObjectId (User)",
  "performanceScore": "number",
  "totalVisits": "number",
  "totalOrders": "number",
  "totalRevenue": "number",
  "retailersAdded": "number"
}
```

#### 2. **SalesmanVisit**
```json
{
  "tenantId": "ObjectId",
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "distributor": "ObjectId",
  "visitDate": "Date",
  "checkInTime": "Date",
  "checkOutTime": "Date",
  "duration": "number (minutes)",
  "purpose": "enum",
  "discussionNotes": "string",
  "productsDiscussed": [{ productId, name, quantity }],
  "competitorProducts": [{ brand, product, price }],
  "retailerInterest": "enum: high|medium|low",
  "visitOutcome": "enum",
  "geoLocation": { latitude, longitude, accuracy },
  "photos": ["string (URLs)"],
  "status": "enum: completed|pending|cancelled"
}
```

#### 3. **RetailerScore**
```json
{
  "tenantId": "ObjectId",
  "retailer": "ObjectId",
  "salesman": "ObjectId",
  "salesPotential": "number (1-100)",
  "storeSize": "enum",
  "productInterest": "number (1-100)",
  "paymentReliability": "number (1-100)",
  "marketLocation": "number (1-100)",
  "estimatedMonthlyTurnover": "number",
  "overallScore": "number (calculated: 0-100)",
  "potential": "enum: high|medium|low",
  "lastUpdated": "Date"
}
```

#### 4. **CompetitorReport**
```json
{
  "tenantId": "ObjectId",
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "visit": "ObjectId",
  "competitorBrand": "string",
  "competitorProduct": "string",
  "retailPrice": "number",
  "packaging": "string",
  "retailerFeedback": "string",
  "marketTrend": "enum: increasing|stable|decreasing",
  "customerPreference": "string",
  "photos": ["string"]
}
```

#### 5. **SalesmanFeedback**
```json
{
  "tenantId": "ObjectId",
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "product": "ObjectId",
  "visit": "ObjectId",
  "feedbackType": "enum",
  "rating": "number (1-5)",
  "feedback": "string",
  "suggestions": ["string"],
  "urgency": "enum: low|medium|high",
  "status": "enum: new|reviewed|resolved"
}
```

#### 6. **SalesmanOrder**
```json
{
  "tenantId": "ObjectId",
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "distributor": "ObjectId",
  "orderId": "string (unique)",
  "items": [{ product, quantity, price, total }],
  "subtotal": "number",
  "gst": "number",
  "discount": "number",
  "total": "number",
  "paymentMode": "enum",
  "status": "enum: draft|submitted|confirmed|delivered",
  "linkedOrder": "ObjectId (to main Order collection)"
}
```

#### 7. **SalesmanFollowUp**
```json
{
  "tenantId": "ObjectId",
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "previousVisit": "ObjectId",
  "followUpDate": "Date",
  "reason": "enum",
  "priority": "enum: low|medium|high",
  "status": "enum: pending|completed|missed",
  "completionDate": "Date",
  "completionNotes": "string"
}
```

#### 8. **SalesmanTarget**
```json
{
  "tenantId": "ObjectId",
  "salesman": "ObjectId",
  "month": "string",
  "year": "number",
  "targetVisits": "number",
  "actualVisits": "number",
  "targetOrders": "number",
  "actualOrders": "number",
  "targetRevenue": "number",
  "actualRevenue": "number",
  "achievementPercentage": "number",
  "status": "enum: active|completed|missed"
}
```

#### 9. **SalesmanPerformance**
```json
{
  "tenantId": "ObjectId",
  "salesman": "ObjectId",
  "month": "string",
  "year": "number",
  "kpis": {
    "visitsCompleted": { target, actual, achievement },
    "ordersGenerated": { target, actual, value },
    "revenueGenerated": { target, actual },
    "retailersAdded": { target, actual },
    "followUpCompletion": { dueFollowUps, completed, percentage }
  },
  "performanceScore": "number (0-100)",
  "rating": "enum: excellent|good|average|below-average",
  "feedbackFromManager": "string"
}
```

#### 10. **SalesmanIncentive**
```json
{
  "tenantId": "ObjectId",
  "salesman": "ObjectId",
  "month": "string",
  "year": "number",
  "baseSalary": "number",
  "incentiveComponents": {
    "salesRevenue": { target, actual, rate, incentive },
    "retailersAdded": { target, actual, rate, incentive },
    "samplesConverted": { target, actual, rate, incentive },
    "productLaunchAdoption": { target, actual, rate, incentive },
    "visitCompliance": { target, actual, rate, incentive }
  },
  "totalIncentive": "number",
  "netPayout": "number",
  "paymentStatus": "enum: pending|approved|paid"
}
```

#### 11. **SalesmanAssignment**
```json
{
  "tenantId": "ObjectId",
  "salesman": "ObjectId",
  "territory": "string",
  "distributors": ["ObjectId"],
  "retailers": ["ObjectId"],
  "productCategories": ["string"],
  "assignmentDate": "Date",
  "status": "enum: active|inactive|transferred",
  "coveragePercentage": "number"
}
```

---

## API Endpoints

### Salesman Management
```
GET    /api/salesmen              - Get all salesmen
GET    /api/salesmen/:id          - Get specific salesman
POST   /api/salesmen              - Create salesman
PATCH  /api/salesmen/:id          - Update salesman
DELETE /api/salesmen/:id          - Delete salesman
GET    /api/salesmen/:id/dashboard - Get salesman dashboard
```

### Visit Management
```
GET    /api/visits                - Get all visits
GET    /api/visits/:id            - Get specific visit
POST   /api/visits                - Create visit
PATCH  /api/visits/:id            - Update visit
GET    /api/visits/salesman/:id/today - Get today's visits
```

### Orders
```
GET    /api/salesman-orders       - Get all orders
POST   /api/salesman-orders       - Create order
PATCH  /api/salesman-orders/:id/status - Update order status
POST   /api/salesman-orders/:id/submit - Submit order
```

### Retailer Scoring
```
GET    /api/retailer-scores       - Get all scores
GET    /api/retailer-scores/retailer/:id - Get retailer score
POST   /api/retailer-scores       - Create/update score
GET    /api/retailer-scores/potential/high - High potential retailers
```

### Competitor Intelligence
```
GET    /api/competitor-reports    - Get all reports
POST   /api/competitor-reports    - Create report
GET    /api/competitor-reports/market/summary - Market intelligence
```

### Performance
```
GET    /api/performance           - Get performance data
POST   /api/performance/calculate/:id - Calculate performance
```

### Follow-Ups
```
GET    /api/followups             - Get all follow-ups
POST   /api/followups             - Create follow-up
PATCH  /api/followups/:id/complete - Complete follow-up
GET    /api/followups/salesman/:id/pending - Pending follow-ups
```

### Feedback
```
GET    /api/feedback              - Get all feedback
POST   /api/feedback              - Create feedback
PATCH  /api/feedback/:id/status   - Update feedback status
```

---

## Frontend Components

### Angular Components (Web)

#### Salesman Module Structure
```
src/app/features/salesman/
├── dashboard/
│   ├── dashboard.ts
│   ├── dashboard.html
│   └── dashboard.scss
├── visits/
│   ├── visit-entry/
│   │   ├── visit-entry.ts
│   │   ├── visit-entry.html
│   │   └── visit-entry.scss
│   ├── visit-list/
│   │   ├── visit-list.ts
│   │   ├── visit-list.html
│   │   └── visit-list.scss
├── retailers/
│   ├── retailer-profile/
│   ├── retailer-list/
│   └── retailer-scoring/
├── orders/
│   ├── order-creation/
│   └── order-list/
├── competitor/
│   ├── competitor-tracking/
│   └── market-intelligence/
└── performance/
    ├── performance-report/
    └── incentives/
```

### Services
```typescript
- SalesmanService        // Manage salesmen
- VisitService          // Visit management
- RetailerScoreService  // Retailer scoring
- CompetitorService     // Market intelligence
- OrderService          // Order management
- PerformanceService    // Performance tracking
- FollowUpService       // Follow-up management
- FeedbackService       // Feedback collection
```

---

## Mobile Components

### Ionic Components

```
src/app/pages/salesman/
├── dashboard/
│   ├── dashboard.ts
│   ├── dashboard.html
│   └── dashboard.scss
├── visits/
│   ├── visit-entry/
│   ├── visits.ts
│   ├── visits.html
│   └── visits.scss
├── orders/
│   ├── create-order/
│   └── orders-list/
├── retailers/
│   ├── retailer-profile/
│   └── retailers-list/
└── competitor/
    └── competitor-tracking/
```

---

## KPI Framework

### Daily KPIs
- **Target Visits**: Set daily target (default: 20)
- **Actual Visits**: Visits completed today
- **Completion Rate**: (Actual / Target) × 100
- **Orders Generated**: Orders placed today
- **Revenue**: Total order value today
- **Follow-Ups Due**: Follow-ups overdue

### Monthly KPIs

| KPI | Target | Actual | Weight | Calculation |
|-----|--------|--------|--------|-------------|
| Visits | 440 (20/day) | TBD | 30% | (Actual/Target) × 30 |
| Orders | 40 | TBD | 25% | (Actual/Target) × 25 |
| Revenue | ₹500,000 | TBD | 25% | (Actual/Target) × 25 |
| Retailers Added | 5 | TBD | 15% | (Actual/Target) × 15 |
| Feedback Collected | 30 | TBD | 5% | (Actual/Target) × 5 |

### Performance Score Calculation
```
Performance Score = 
  (Visits Achievement × 0.30) +
  (Orders Achievement × 0.25) +
  (Revenue Achievement × 0.25) +
  (Retailers Added × 0.15) +
  (Feedback Collection × 0.05)

Score Rating:
- 80-100: Excellent
- 60-79: Good
- 40-59: Average
- 20-39: Below Average
- 0-19: Poor
```

---

## Incentive Structure

### Incentive Components

#### 1. Sales Revenue Incentive
```
Rate: 2-5% of order value
Example: 
  Achieved Revenue: ₹600,000
  Target: ₹500,000
  Achievement: 120%
  Incentive Rate: 3%
  Incentive: ₹600,000 × 3% × 1.2 = ₹21,600
```

#### 2. Retailers Added Incentive
```
Rate: ₹500-1,000 per retailer
Example:
  Added Retailers: 7
  Target: 5
  Rate: ₹750
  Incentive: 7 × ₹750 = ₹5,250
```

#### 3. Sample Conversion Incentive
```
Rate: ₹200 per sample converted to order
Example:
  Samples Converted: 15
  Incentive: 15 × ₹200 = ₹3,000
```

#### 4. Product Launch Incentive
```
Rate: ₹100-500 per retailer interested
Example:
  Retailers Interested: 25
  Rate: ₹250
  Incentive: 25 × ₹250 = ₹6,250
```

#### 5. Visit Compliance Bonus
```
Target: 20 visits/day
Bonus: ₹100 per day if target achieved
Example:
  Working Days: 22
  Days Compliant: 20
  Bonus: 20 × ₹100 = ₹2,000
```

### Monthly Incentive Calculation

```
Base Salary: ₹15,000
Sales Revenue Incentive: ₹21,600
Retailers Added Incentive: ₹5,250
Sample Conversion Incentive: ₹3,000
Product Launch Incentive: ₹6,250
Visit Compliance Bonus: ₹2,000
────────────────────────────
Total Incentive: ₹38,100
Deductions (if any): -₹500
────────────────────────────
Net Payout: ₹52,600
```

---

## Dashboard Designs

### 1. Salesman Home Dashboard
- Today's target visits vs. completed
- Orders generated (quantity + value)
- New retailers added
- Revenue generated
- Follow-ups due
- Quick action buttons

### 2. Company Dashboard (Salesman Analytics)
- Salesman performance scorecard
- Territory coverage maps
- Market intelligence summary
- Top performing salesmen
- Retailers by potential
- Revenue by salesman
- Competitor trends

### 3. Distributor Dashboard
- Orders from salesmen
- New retailer registrations
- Market feedback
- Sample requests
- Retailer onboarding status

---

## Deployment Guide

### Prerequisites
- Node.js 20+ 
- MongoDB 5.0+
- Angular CLI 22
- Ionic CLI 7

### Backend Setup
```bash
cd backend
npm install
# Update .env with MongoDB connection
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# Access at http://localhost:4200
```

### Mobile Setup
```bash
cd mobile
npm install
ionic serve
# Or build for iOS/Android
ionic build
ionic capacitor add ios
ionic capacitor add android
```

---

## Security & Compliance

### Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Tenant isolation enforced at API level
- Secure password hashing (bcrypt)

### Data Protection
- MongoDB encryption at rest
- TLS for API communication
- PII data masked in logs
- Audit trails for critical operations

### Compliance
- GDPR-compliant data handling
- GST compliance for invoice generation
- Local data residency options

---

## Support & Maintenance

### Version: 1.0.0
### Last Updated: June 2026
### Status: Production Ready

---

## Scalability Plan

### Phase 1 (Current)
- Single MongoDB cluster
- Express.js servers
- Redis caching for performance

### Phase 2 (Q3 2026)
- Microservices architecture
- Kafka for event streaming
- ElasticSearch for analytics

### Phase 3 (Q4 2026)
- ML-powered performance prediction
- Real-time dashboard with WebSockets
- Advanced analytics engine
