# Salesman Module - Product Requirements & User Stories

## Executive Summary

The Salesman Module enables FMCG distribution companies to digitize their field force operations, providing complete visibility into sales activities, retailer interactions, and market conditions in real-time.

---

## Product Requirements Document (PRD)

### 1. Business Objectives

**Primary Goals:**
1. Eliminate paper-based field operations
2. Provide real-time visibility into sales force activities
3. Improve retailer coverage and engagement
4. Capture market intelligence systematically
5. Enable data-driven incentive calculations
6. Increase order collection efficiency

**Success Metrics:**
- 95% visit recording within 24 hours
- 40% increase in order capture from field
- 30% reduction in retailer onboarding time
- 25% improvement in retailer retention
- 20% increase in new product adoption

---

### 2. Scope

**In Scope:**
- Visit management and tracking
- Retailer profiling and scoring
- Order collection from field
- Competitor intelligence gathering
- Performance KPI tracking
- Incentive calculation
- Follow-up management
- Mobile offline capability

**Out of Scope (Phase 2):**
- Real-time location tracking (Phase 2)
- Route optimization (Phase 2)
- Predictive analytics (Phase 2)
- Third-party integrations (Phase 2)

---

### 3. User Personas

#### Persona 1: Salesman (Field Force)
- **Age:** 25-40
- **Tech Proficiency:** Low to Medium
- **Daily Activities:** Visit retailers, collect orders, gather feedback
- **Pain Points:** Manual paperwork, lost data, delayed incentives
- **Needs:** Simple mobile app, offline capability, quick data entry

#### Persona 2: Distributor Admin
- **Age:** 30-50
- **Tech Proficiency:** Medium
- **Daily Activities:** Monitor salesmen performance, approve orders
- **Pain Points:** Limited visibility, manual reporting
- **Needs:** Dashboards, real-time alerts, export capabilities

#### Persona 3: Company Admin
- **Age:** 35-55
- **Tech Proficiency:** Medium to High
- **Daily Activities:** Strategic planning, performance analysis
- **Pain Points:** Incomplete data, delayed insights
- **Needs:** Comprehensive analytics, forecasting, team comparisons

---

## User Stories

### Epic 1: Visit Management

#### Story 1.1: Record Visit
```
As a salesman,
I want to record each store visit with date, time, purpose, and notes,
So that my activities are tracked and reported to management.

Acceptance Criteria:
- Mobile app provides simple form to enter visit details
- Offline capability allows recording without internet
- GPS location captured automatically
- Check-in and check-out times recorded
- Photos can be attached
- Status tracked (pending, completed, cancelled)

Definition of Done:
- Form validates required fields
- Data syncs when online
- Images optimized and compressed
- Error handling for failed submissions
```

#### Story 1.2: Visit Outcome Tracking
```
As a distributor admin,
I want to see outcomes of each visit (order placed, demo given, etc.),
So that I understand what activities are driving results.

Acceptance Criteria:
- Each visit has outcome field (order-placed, completed, follow-up-required)
- Outcomes filtered and sorted on dashboard
- Reports show outcome distribution
- Alerts for no-action visits

Definition of Done:
- Dashboard updated in real-time
- Historical data migrated
- Export functionality includes outcomes
```

#### Story 1.3: Competitor Products Tracking
```
As a salesman,
I want to record competitor products seen at retail stores,
So that management understands market dynamics.

Acceptance Criteria:
- Form captures brand, product, price, retailer feedback
- Photos of competitor products can be uploaded
- Market trends tracked (increasing, stable, decreasing)
- Competitor database built over time

Definition of Done:
- Validation for required fields
- Image compression implemented
- Market summary dashboard created
```

---

### Epic 2: Retailer Management

#### Story 2.1: Retailer Scoring System
```
As a company admin,
I want retailers automatically scored on potential (high/medium/low),
So that salesmen can prioritize high-value retailers.

Acceptance Criteria:
- Score calculated from:
  - Sales potential (30%)
  - Product interest (25%)
  - Payment reliability (25%)
  - Market location (20%)
- Score ranges 0-100
- Potential classification automatic (high ≥75, medium 50-74, low <50)
- Score updated quarterly or on-demand

Definition of Done:
- Algorithm implemented and tested
- Historical scoring completed
- Salesmen can view scores
- Dashboard shows potential distribution
```

#### Story 2.2: Retailer Onboarding
```
As a salesman,
I want to add new retailers during field visits,
So that the retailer database stays current.

Acceptance Criteria:
- Form captures retailer details (name, location, contact, etc.)
- GST validation
- Store type classification
- Photo of store captured
- Status workflow (added → verified → approved)

Definition of Done:
- Form validates all required fields
- Duplicate detection prevents duplicates
- Approval workflow implemented
- Dashboard shows new retailer pipeline
```

---

### Epic 3: Order Management

#### Story 3.1: Field Order Creation
```
As a salesman,
I want to create orders directly from retail stores,
So that I don't need to carry order forms or documentation.

Acceptance Criteria:
- Mobile form with product search and quantity entry
- Price auto-filled from product catalog
- GST calculated automatically
- Payment modes supported (cash, credit, cheque, digital)
- Order status workflow (draft → submitted → confirmed → delivered)

Definition of Done:
- Form includes all required fields
- Calculations verified for accuracy
- Offline mode allows saving drafts
- Order syncs to distributor on submit
```

#### Story 3.2: Order Fulfillment Tracking
```
As a distributor admin,
I want to track orders from field through delivery,
So that I know order status and can ensure fulfillment.

Acceptance Criteria:
- Orders from salesmen show in pending list
- Status updated as order progresses
- Delivery confirmation captured
- Late deliveries flagged

Definition of Done:
- Status workflow fully implemented
- Notifications sent on status changes
- Reports show fulfillment metrics
```

---

### Epic 4: Performance Tracking

#### Story 4.1: Daily KPI Dashboard
```
As a salesman,
I want to see my daily progress vs. targets,
So that I know if I'm on track.

Acceptance Criteria:
- Target visits displayed prominently
- Actual visits updated in real-time
- Orders count and value shown
- Follow-ups due highlighted
- Performance % displayed
- Mobile-friendly layout

Definition of Done:
- Dashboard loads in <2 seconds
- Real-time updates via API
- Works offline (cached data)
```

#### Story 4.2: Monthly Performance Rating
```
As a company admin,
I want to see each salesman's monthly performance rating,
So that I can manage incentives and identify high/low performers.

Acceptance Criteria:
- Performance score calculated monthly (0-100)
- Rating assigned (excellent/good/average/below-average/poor)
- Based on KPI achievements
- Historical comparison available
- Benchmarking against peers

Definition of Done:
- Algorithm implemented and tested
- Historical data calculated
- Dashboard shows performance trends
- Export includes detailed KPI breakdown
```

---

### Epic 5: Incentive Management

#### Story 5.1: Incentive Calculation
```
As a company admin,
I want incentives calculated automatically based on performance,
So that payouts are accurate and timely.

Acceptance Criteria:
- Incentive components calculated:
  - Sales revenue bonus (2-5% of order value)
  - Retailers added (₹500-1000 per retailer)
  - Samples converted (₹200 per conversion)
  - Product launch adoption (₹100-500 per retailer)
  - Visit compliance bonus (₹100 per day)
- Total incentive = base salary + components - deductions
- Monthly calculation by 5th of next month

Definition of Done:
- Algorithm implemented and tested
- Historical incentives calculated
- Salesman can view their incentive breakdown
- Payment status tracked (pending/approved/paid)
```

#### Story 5.2: Incentive Approval Workflow
```
As a distributor admin,
I want to approve/reject incentives before payout,
So that I can ensure accuracy and fairness.

Acceptance Criteria:
- Incentive pending review shows in dashboard
- Details breakdown available for review
- Approval or rejection with notes
- Deductions can be applied if needed
- Approved incentives mark for payment

Definition of Done:
- Workflow implemented
- Notifications sent on approval/rejection
- Audit trail maintained for all decisions
- Payment file generated for finance
```

---

### Epic 6: Follow-Up Management

#### Story 6.1: Follow-Up Creation
```
As a salesman,
I want to schedule follow-ups during visits,
So that I don't forget to revisit retailers.

Acceptance Criteria:
- Follow-up date can be set during visit or manually
- Reason captured (order-follow-up, product-launch, etc.)
- Priority set (low/medium/high)
- Notes added for context
- Calendar view of upcoming follow-ups

Definition of Done:
- Form integrated with visit entry
- Calendar component displays follow-ups
- Mobile notifications for due follow-ups
- Can be marked complete/rescheduled
```

#### Story 6.2: Follow-Up Compliance Tracking
```
As a company admin,
I want to track follow-up completion rates,
So that I can ensure consistent retailer engagement.

Acceptance Criteria:
- Follow-ups categorized as completed/missed/rescheduled
- Missed follow-ups flagged
- Compliance % calculated
- Reports show follow-up performance by salesman
- Alerts for overdue follow-ups

Definition of Done:
- Dashboard shows compliance metrics
- Historical data tracked
- Reports exportable
- Alerts configured and tested
```

---

### Epic 7: Market Intelligence

#### Story 7.1: Competitor Tracking Dashboard
```
As a company admin,
I want to see market intelligence from field reports,
So that I understand competitive landscape.

Acceptance Criteria:
- Competitor brand tracking
- Product-level price monitoring
- Market trend analysis (increasing/stable/decreasing)
- Retailer sentiment captured
- Regional competitor comparison

Definition of Done:
- Dashboard displays market summary
- Charts show trend analysis
- Competitor list sortable by reports/trend
- Export market intelligence reports
```

#### Story 7.2: Feedback Collection
```
As a distributor admin,
I want to collect retailer feedback on products,
So that product team gets market insights.

Acceptance Criteria:
- Feedback types captured (quality, packaging, pricing, demand, etc.)
- Rating 1-5 scale
- Urgency flagged if needed
- Actionable feedback identified
- Status tracked (new → reviewed → resolved)

Definition of Done:
- Feedback form integrated with visit entry
- Feedback dashboard for product team
- Notification system for urgent feedback
- Action workflow implemented
```

---

## Implementation Roadmap

### Phase 1 (Current - June 2026)
**Duration:** 4 weeks

**Deliverables:**
- Visit management core
- Basic order creation
- Retailer scoring
- Performance dashboard (salesman)
- Mobile visit entry

**Success Criteria:**
- 50% of salesmen recording visits digitally
- 80% data accuracy
- <100ms API response time

### Phase 2 (July 2026)
**Duration:** 4 weeks

**Deliverables:**
- Route optimization
- Real-time location tracking
- Advanced reporting
- Competitor intelligence dashboard
- Offline sync improvements

### Phase 3 (August 2026)
**Duration:** 4 weeks

**Deliverables:**
- Predictive analytics
- ML-based retailer scoring
- Automated incentive calculations
- Third-party integrations (ERP, CRM)

---

## Non-Functional Requirements

### Performance
- API response time: <200ms (p95)
- Dashboard load time: <2 seconds
- Mobile app size: <50MB
- Offline capability: 7 days of data

### Security
- JWT-based authentication
- AES-256 data encryption at rest
- TLS 1.2+ for data in transit
- RBAC for all operations
- PII data masking in logs

### Scalability
- Support 10,000 salesmen
- 1M visits/month
- 100K orders/day
- 99.9% uptime SLA

### Compatibility
- Mobile: iOS 12+, Android 8+
- Web: Chrome, Firefox, Safari, Edge
- Offline: 100MB local storage

---

## Success Metrics

### Adoption
- 90% of field staff using app within 3 months
- 95% daily visit recording rate
- <10% data entry errors

### Business Impact
- 40% increase in orders captured
- 30% faster order processing
- 25% improvement in retailer retention
- 20% faster retailer onboarding

### Technical
- 99.9% uptime
- <200ms API response time
- <2s dashboard load time
- 95% data sync success rate

---

## Risk Mitigation

### Risk: Low adoption among field staff
**Mitigation:**
- Extensive training program
- Incentives for digital adoption
- Simple UI/UX design
- 24/7 support helpline

### Risk: Data loss due to poor connectivity
**Mitigation:**
- Robust offline-first architecture
- Automatic sync retry mechanism
- Data backup to cloud
- Local encryption

### Risk: Performance degradation with scale
**Mitigation:**
- Database indexing strategy
- API caching layer
- Database replication
- Load testing completed

---

## Acceptance Criteria by Module

| Module | Criteria |
|--------|----------|
| Visit Management | 100+ visits/day, <2% data loss |
| Retailer Scoring | 95% accuracy vs. manual scoring |
| Order Management | 50+ orders/day, 99% calculation accuracy |
| Performance Tracking | Real-time KPI updates, <1s refresh |
| Incentive Management | 100% calculation accuracy, audit trail |
| Follow-Ups | 90% completion rate, 0 missed critical |
| Market Intelligence | 100% data collection, trending visible |

