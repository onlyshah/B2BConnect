# B2BConnect Platform - MVP Scope & Roadmap

## MVP Definition (Phase 1: Weeks 1-16)

**Goal:** Launch a working platform with core features for one market (FMCG) to validate the business model and gather user feedback.

**Target Users (MVP):**
- 10 Companies
- 100 Distributors
- 500 Salesmen
- 5,000 Retailers

**Success Criteria:**
- 90% user active weekly
- 50+ orders/day
- 4.0+ app store rating
- <2s web page load
- 99% uptime

---

## MVP Features by App

### 1. Company App (MVP)

#### ✅ Included Features
- **Authentication**
  - Registration with email verification
  - Login with email/password
  - Forgot password
  - Multi-device login (web only in MVP)

- **Dashboard**
  - Real-time KPI cards (orders, revenue, retailers, salesmen)
  - Recent orders list
  - Active salesmen count
  - Quick action buttons

- **Product Management**
  - Create/Edit products (name, category, price, images)
  - Product variants (sizes)
  - Product status (active/discontinued)
  - Search and filter products
  - Bulk product upload (CSV)

- **Distributor Management**
  - View all distributors
  - Approve/Reject distributor applications
  - Distributor details with stats
  - Assign territories
  - View connected retailers per distributor

- **Salesman Management**
  - View all salesmen
  - Approve/Reject salesman applications
  - Assign territories and retailers
  - View salesman performance (basic)
  - Invite salesmen

- **Territory Management**
  - Create territories (city level)
  - Assign distributors to territory
  - Assign salesmen to territory
  - View territory map

- **Orders & Analytics**
  - View all orders (with status filters)
  - Basic analytics (total orders, revenue)
  - Export order reports (CSV)

- **Notifications**
  - In-app notifications for approvals
  - Email notifications (configurable)

#### ❌ Excluded from MVP
- Story feed with videos
- Sample request workflow
- Advanced competitor tracking
- Advertising platform
- Multi-company support for retailers
- Mobile app
- Incentive management UI

---

### 2. Distributor App (MVP)

#### ✅ Included Features
- **Authentication**
  - Self-registration (apply to company)
  - Login with email/password
  - Company approval workflow

- **Dashboard**
  - KPI cards (pending orders, collections due, low stock alerts)
  - Recent orders list
  - Top retailers
  - Quick action buttons

- **Retailer Management**
  - View list of retailers (with filters)
  - Approve/Reject retailer applications
  - Retailer details (shop name, address, contact)
  - View retailer credit limit and outstanding balance
  - View retailer order history

- **Order Management**
  - View all orders (with status filters)
  - Update order status (Accepted → Packed → Shipped → Delivered)
  - Order details with items list
  - Print invoice from order

- **Inventory Management**
  - Stock level dashboard (grid view)
  - Update stock quantities
  - Stock history (simple log)
  - Low stock alerts (manual threshold setting)
  - Reorder point configuration

- **Collections**
  - Record collection (cash, cheque, bank transfer)
  - View collection history
  - Collection reports by retailer
  - Payment reminders to retailer

- **Invoices**
  - Auto-generate invoices on order confirmation
  - Print/Download invoice (PDF)
  - Invoice history

- **Notifications**
  - In-app notifications for new orders
  - Email notifications for collections

#### ❌ Excluded from MVP
- Pricing management (use company prices)
- Discount management
- Payment reconciliation
- Staff management
- Advanced analytics
- Mobile app
- Real-time notifications

---

### 3. Salesman App (MVP - Mobile Priority)

#### ✅ Included Features
- **Authentication**
  - Registration and application to company
  - Login with email/password
  - Company approval workflow

- **Dashboard (Home)**
  - Today's KPI (target visits, completed visits, orders)
  - Pending follow-ups
  - Quick action buttons
  - Monthly performance score

- **Retailers Management**
  - View assigned retailers list
  - Retailer details (address, contact, last visit, balance)
  - Search retailers
  - Add new retailer (registration form)

- **Visit Tracking**
  - Record visit (retailer, date, time)
  - GPS check-in/check-out (auto-capture coordinates)
  - Visit purpose (order collection, product demo, feedback)
  - Discussion notes (text input)
  - Auto-calculate visit duration
  - Record competitor products observed
  - Visit completion workflow

- **Order Creation**
  - Create salesman-assisted order
  - Select items from product catalog
  - Auto-fill prices from distributor rates
  - Calculate total with GST (18%)
  - Submit for retailer verification
  - Order status tracking

- **Follow-Ups**
  - Create follow-up task
  - Schedule follow-up date
  - Mark follow-up complete
  - View pending follow-ups

- **Performance Dashboard**
  - Today's metrics (visits, orders, revenue)
  - Monthly metrics (target vs actual)
  - Performance score calculation
  - Simple trend chart

- **Offline Support**
  - Record visits without internet
  - Sync when connection restored
  - Queue orders offline

#### ❌ Excluded from MVP
- Location history/map view
- Competitor intelligence dashboard
- Product videos
- Sample requests
- Photo uploads
- Advanced analytics
- Incentive details
- Real-time synchronization

---

### 4. Retailer App (MVP - Mobile Priority)

#### ✅ Included Features
- **Authentication**
  - Registration (shop name, owner name, address)
  - Auto-matching with nearby distributors
  - Login with email/password
  - Distributor approval workflow

- **Home Dashboard**
  - Shop info card
  - Outstanding balance
  - Credit limit and available credit
  - Recent orders

- **Product Catalog**
  - Browse products by category
  - Product search
  - Product details (name, price, availability)
  - Filter by price range
  - Sort by relevance/price/popularity

- **Order Management**
  - Create order (select products, qty, add to cart)
  - Review order summary
  - Select payment mode (cash/credit/cheque/bank transfer)
  - Submit order
  - View order status (tracking)
  - Order history with filters

- **Order Verification (Salesman Orders)**
  - Receive notification for salesman order
  - Review order details
  - Approve/Reject
  - Request changes (simple text note)

- **Invoices & Balance**
  - View order invoices
  - Download invoice (PDF)
  - Outstanding balance display
  - Payment history (simple list)
  - Payment reminders

- **Samples**
  - Request product samples
  - Sample status tracking
  - Link samples to orders

- **Notifications**
  - Order confirmation
  - Order shipped
  - Order delivered
  - Payment reminder
  - Promotional offers

#### ❌ Excluded from MVP
- Product videos
- Story feed
- Advanced reviews and ratings
- Comparison tool
- Wishlist
- Multiple payment gateway integration
- Web version

---

## Feature Breakdown by Complexity

### Phase 1 MVP (Weeks 1-16)

#### Week 1-3: Backend Infrastructure
- [x] Database schema design
- [x] User authentication (JWT)
- [x] Role-based access control
- [x] Multi-tenancy setup
- [x] API boilerplate
- [x] Error handling
- [x] Logging

#### Week 4-6: Core APIs
- [x] User management APIs
- [x] Company/Distributor/Salesman/Retailer APIs
- [x] Product management APIs
- [x] Order management APIs
- [x] Inventory APIs
- [x] Collection APIs
- [x] Invoice generation

#### Week 7-9: Company App
- [x] Authentication pages
- [x] Dashboard
- [x] Product CRUD
- [x] Distributor management
- [x] Salesman management
- [x] Territory management
- [x] Analytics dashboard
- [x] Settings

#### Week 10-12: Distributor App
- [x] Authentication pages
- [x] Dashboard
- [x] Retailer management
- [x] Order management
- [x] Inventory management
- [x] Collections tracking
- [x] Invoice generation
- [x] Settings

#### Week 13-15: Salesman & Retailer Apps
- [x] Salesman App: Complete mobile app
- [x] Retailer App: Complete mobile app
- [x] Offline sync
- [x] GPS integration

#### Week 16: Testing & Deployment
- [x] Unit tests (critical paths)
- [x] Integration tests
- [x] E2E tests (UAT)
- [x] Performance testing
- [x] Security audit
- [x] Docker setup
- [x] AWS deployment
- [x] Monitoring setup

---

## Technology Stack (MVP)

### Backend
- **Node.js:** v20.x LTS
- **Express.js:** 4.18.x
- **MongoDB:** 5.0+
- **Redis:** 7.x
- **Port:** 4000

### Frontend (Company & Distributor)
- **Framework:** Angular 22.x
- **Styling:** CSS Grid, Flexbox
- **Build:** @angular/build
- **TypeScript:** 6.x

### Mobile (Salesman & Retailer)
- **Framework:** Ionic 8.x + Angular 22.x
- **Capacitor:** 6.x
- **Native Bridge:** GPS, Camera, Storage

### DevOps
- **Containerization:** Docker
- **Orchestration:** Kubernetes (EKS)
- **CI/CD:** GitHub Actions / GitLab CI
- **Monitoring:** CloudWatch + Sentry
- **Hosting:** AWS (EC2, RDS, S3, CloudFront)

---

## MVP Budget & Timeline

### Development Team (MVP)
- Backend Engineer: 1 (full-time)
- Frontend Engineer: 1 (full-time)
- Mobile Engineer: 1 (full-time)
- DevOps Engineer: 0.5 (part-time)
- Product Manager: 1 (full-time)
- QA Engineer: 1 (full-time)

**Total: 5.5 FTE**

### Timeline: 16 Weeks

| Phase | Duration | Deliverable |
|-------|----------|------------|
| Planning & Design | Week 1 | PRD, Design, Architecture |
| Backend Dev | Week 2-6 | APIs (30+ endpoints) |
| Frontend Dev | Week 7-12 | Company & Distributor Apps |
| Mobile Dev | Week 10-15 | Salesman & Retailer Apps |
| Testing & QA | Week 13-16 | Bug fixes, UAT |
| Deployment | Week 16 | Production launch |

### Cost Estimate

| Item | Cost |
|------|------|
| Developer Salaries (16 weeks) | ₹15,00,000 |
| AWS Infrastructure | ₹2,00,000 |
| Design & UX | ₹2,00,000 |
| Testing & QA | ₹1,50,000 |
| App Store Publishing | ₹50,000 |
| Miscellaneous | ₹50,000 |
| **Total** | **₹21,50,000** |

---

## Phase 2 Roadmap (Weeks 17-32 / 8 Weeks)

### Features to Add
- ✅ Story feed with video support
- ✅ Sample request workflow
- ✅ Competitor intelligence dashboard
- ✅ Advanced analytics with charts
- ✅ Pricing and discount management
- ✅ Payment integration (Razorpay, PayU)
- ✅ Incentive management UI
- ✅ Multi-company support for retailers
- ✅ Web versions for Salesman & Retailer apps
- ✅ Real-time notifications (WebSocket)

### Enhancements
- Real-time order tracking
- Location history for salesmen
- Retailer potential scoring
- Route optimization suggestions
- Offline-first mobile improvements
- Dark mode support

---

## Phase 3 Roadmap (Weeks 33-48 / 4 Weeks)

### Advanced Features
- ✅ AI-powered product recommendations
- ✅ Distributor marketplace (inter-distributor ordering)
- ✅ Advertising platform
- ✅ Advanced competitor tracking
- ✅ Predictive analytics
- ✅ Integration with ERP systems
- ✅ Multi-language support
- ✅ Mobile payment integration
- ✅ SMS/WhatsApp notifications

### Expansion
- Support for additional product categories
- International market expansion
- B2B marketplace features
- API for third-party integrations

---

## Success Metrics (MVP)

### User Adoption
- [ ] 500+ active companies
- [ ] 5,000+ active retailers ordering monthly
- [ ] 1,000+ visits recorded daily
- [ ] 100+ orders created daily

### Business Metrics
- [ ] ₹50M+ monthly order value
- [ ] 2-3% commission collection
- [ ] 80%+ repeat order rate
- [ ] 45+ average days to profitability

### Product Quality
- [ ] 99% uptime
- [ ] <200ms API response (p95)
- [ ] <2s web page load
- [ ] 4.0+ app store rating
- [ ] <1% critical bug rate

### User Satisfaction
- [ ] 80%+ NPS score
- [ ] 4.5/5.0 average rating
- [ ] <2% churn rate
- [ ] 90%+ weekly active users

---

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Slow adoption | High | High | Early adopter program, incentives |
| Data loss | Low | Critical | Daily backups, disaster recovery |
| API scaling issues | Medium | High | Load testing, caching strategy |
| Low distributor interest | High | High | Direct partnerships, demo stores |
| Competitive pressure | Medium | Medium | First-mover advantage, network effects |
| Technology debt | High | Medium | Code reviews, testing, documentation |

---

## Go-to-Market Strategy

### Phase 1: Soft Launch (Week 15)
- Launch in 1 city (Bangalore)
- Onboard 10 companies manually
- Gather feedback from early users

### Phase 2: Beta Launch (Week 16)
- Open beta access
- Onboard 100 distributors
- Offer incentives for referrals

### Phase 3: Public Launch (Week 17+)
- Press release
- Social media campaign
- Sales outreach to companies
- App store launch

### Phase 4: Scale (Week 20+)
- Expand to 5 cities
- Marketing partnerships
- Influencer collaborations
- B2B conferences

---

## Success Signals to Watch

✅ **Positive:**
- High daily active user %
- Increasing orders per user
- Low churn rate
- Positive user reviews
- Strong word-of-mouth

❌ **Negative:**
- Low conversion from signup to first order
- High app uninstall rate
- API errors/crashes
- Negative reviews
- Distributor pushback

---

## Post-MVP Priorities

1. **Stability:** Fix bugs, improve performance
2. **Retention:** Improve UX based on feedback
3. **Growth:** Scale to more cities, marketing
4. **Monetization:** Launch premium features
5. **Expansion:** Add product categories

