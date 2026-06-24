# Salesman Module - Setup & Deployment Guide

## Quick Start

### Prerequisites
- Node.js 20.x LTS
- MongoDB 5.0+
- npm 10.x
- Git
- Angular CLI 22
- Ionic CLI 7

### Installation Time: ~30 minutes

---

## Backend Setup

### 1. Install Dependencies
```bash
cd d:\Distributor\B2BConnect\backend
npm install
```

### 2. Environment Configuration
Create `.env` file:
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/b2bconnect
JWT_SECRET=your_secure_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

### 3. Verify Models and Routes
```bash
# Check models exist
ls -la models/ | grep -E "(Salesman|Visit|Retailer|Competitor)"

# Check routes exist
ls -la routes/ | grep -E "(salesman|visits|salesman-orders|retailer-scores|competitor|performance|followups|feedback)"
```

### 4. Start Backend
```bash
npm start
```

**Expected Output:**
```
MongoDB connected
B2BConnect backend running on port 4000
```

### 5. Test Backend
```bash
# Health check
curl http://localhost:4000/health
# Response: { "status": "ok" }
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd d:\Distributor\B2BConnect\frontend
npm install --legacy-peer-deps
```

### 2. Environment Configuration
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api'
};
```

### 3. Start Frontend
```bash
npm start
```

**Expected Output:**
```
✔ Compiled successfully
Application bundle generated successfully
Listening on: http://localhost:4200/
```

### 4. Access Frontend
Open browser: `http://localhost:4200`

---

## Mobile Setup

### 1. Install Dependencies
```bash
cd d:\Distributor\B2BConnect\mobile
npm install --legacy-peer-deps
```

### 2. Environment Configuration
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api'
};
```

### 3. Run in Browser
```bash
ionic serve
```

Access at: `http://localhost:8100`

### 4. Build for iOS
```bash
ionic build
ionic capacitor add ios
ionic capacitor build ios
# Then open in Xcode:
open ios/App/App.xcworkspace
```

### 5. Build for Android
```bash
ionic build
ionic capacitor add android
ionic capacitor build android
# Then open in Android Studio:
android/app
```

---

## API Testing

### Using Postman

1. **Create Collection:** B2BConnect Salesman
2. **Add Variable:** `baseUrl = http://localhost:4000/api`
3. **Add Variable:** `token = {JWT_TOKEN}`
4. **Add Variable:** `tenantId = {TENANT_ID}`

### Sample Requests

#### 1. Login
```
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "password123"
}
```

#### 2. Create Salesman
```
POST {{baseUrl}}/salesmen
Content-Type: application/json
Authorization: Bearer {{token}}
X-Tenant-Id: {{tenantId}}

{
  "name": "Rajesh Kumar",
  "email": "rajesh@company.com",
  "phone": "9876543210",
  "employeeId": "EMP001",
  "territory": "North Mumbai",
  "dailyVisitTarget": 20
}
```

#### 3. Record Visit
```
POST {{baseUrl}}/visits
Content-Type: application/json
Authorization: Bearer {{token}}
X-Tenant-Id: {{tenantId}}

{
  "salesman": "SALESMAN_ID",
  "retailer": "RETAILER_ID",
  "visitDate": "2024-06-15",
  "purpose": "order-collection",
  "visitOutcome": "order-placed"
}
```

#### 4. Get Performance
```
GET {{baseUrl}}/performance?salesman=SALESMAN_ID&month=June&year=2024
Authorization: Bearer {{token}}
X-Tenant-Id: {{tenantId}}
```

---

## Database Setup

### 1. Start MongoDB
```bash
# On Windows
mongod

# On macOS
brew services start mongodb-community
```

### 2. Connect to Database
```bash
mongo b2bconnect
```

### 3. Create Indexes
```javascript
// Run in MongoDB console
use b2bconnect

// Salesman indexes
db.salesmen.createIndex({ tenantId: 1, email: 1 })
db.salesmen.createIndex({ tenantId: 1, territory: 1 })
db.salesmen.createIndex({ tenantId: 1, status: 1 })

// Visit indexes
db.salesmanvisits.createIndex({ tenantId: 1, salesman: 1 })
db.salesmanvisits.createIndex({ tenantId: 1, retailer: 1 })
db.salesmanvisits.createIndex({ tenantId: 1, visitDate: 1 })

// Order indexes
db.salesmanorders.createIndex({ tenantId: 1, salesman: 1 })
db.salesmanorders.createIndex({ tenantId: 1, status: 1 })
```

### 4. Seed Sample Data
```javascript
// Create sample company
db.companies.insertOne({
  tenantId: "tenant123",
  name: "Sample Company",
  industry: "FMCG",
  modules: {
    salesmanModule: {
      enabled: true,
      salesmenCount: 0,
      dailyVisitTarget: 20
    }
  }
})

// Create sample salesman
db.salesmen.insertOne({
  tenantId: "tenant123",
  name: "Rajesh Kumar",
  email: "rajesh@company.com",
  phone: "9876543210",
  employeeId: "EMP001",
  territory: "North Mumbai",
  status: "active",
  dailyVisitTarget: 20,
  totalVisits: 0,
  totalOrders: 0,
  totalRevenue: 0,
  retailersAdded: 0,
  performanceScore: 0
})
```

---

## Docker Deployment

### 1. Create Dockerfile for Backend
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/b2bconnect
      NODE_ENV: production
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "4200:4200"
    depends_on:
      - backend

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### 3. Build and Run
```bash
docker-compose up -d
```

---

## Cloud Deployment (AWS)

### 1. Elastic Beanstalk
```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure

# Initialize Elastic Beanstalk
cd backend
eb init -p "Node.js 20 running on 64bit" b2bconnect-backend

# Create environment
eb create b2bconnect-backend-prod

# Deploy
eb deploy
```

### 2. MongoDB Atlas
```
1. Create cluster at mongodb.com
2. Get connection string: mongodb+srv://user:pass@cluster.mongodb.net/b2bconnect
3. Update .env: MONGODB_URI=<connection_string>
```

### 3. S3 for File Storage
```bash
# Create S3 bucket
aws s3 mb s3://b2bconnect-files

# Update backend to use S3 for photos
npm install aws-sdk
```

### 4. CloudFront for CDN
```
1. Create distribution for S3 bucket
2. Configure CORS
3. Update file URLs in backend
```

---

## Performance Tuning

### Database Optimization
```javascript
// Add compound indexes for common queries
db.salesmanvisits.createIndex({
  tenantId: 1,
  salesman: 1,
  visitDate: -1
})

// Enable query profiling
db.setProfilingLevel(1)

// Check slow queries
db.system.profile.find({ millis: { $gt: 100 } }).limit(10)
```

### API Response Caching
```javascript
// Install Redis
npm install redis express-redis-cache

// Add to server.js
const redis = require('redis');
const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});
```

### Database Connection Pooling
```javascript
// Update Mongoose connection
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 45000
});
```

---

## Monitoring & Logging

### 1. Setup Logging
```bash
npm install winston
npm install express-winston
```

### 2. Configure Logs
```javascript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 3. Monitor Performance
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "b2bconnect-backend"

# Monitor
pm2 monit
```

---

## Troubleshooting

### Issue: Backend won't start
```bash
# Check port 4000 is not in use
lsof -i :4000

# Check MongoDB connection
mongo mongodb://localhost:27017/b2bconnect

# Clear npm cache
npm cache clean --force
```

### Issue: Frontend won't compile
```bash
# Clear Angular cache
rm -rf .angular/cache

# Reinstall with peer dependency resolution
npm install --legacy-peer-deps

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Issue: API returns 401 Unauthorized
```
Check:
1. JWT_SECRET matches between frontend and backend
2. Token not expired (15 min access, 7 day refresh)
3. Authorization header format: "Bearer {TOKEN}"
4. Tenant ID header present: "X-Tenant-Id"
```

### Issue: MongoDB connection timeout
```javascript
// Update connection options
mongoose.connect(MONGODB_URI, {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
});
```

---

## Health Check Endpoints

```bash
# Backend health
curl http://localhost:4000/health

# Database connection
curl http://localhost:4000/api/auth/health

# Frontend (after build)
curl http://localhost:4200/
```

---

## Backup & Recovery

### Daily Database Backup
```bash
# Backup MongoDB
mongodump --db b2bconnect --out /backups/b2bconnect_$(date +%Y%m%d)

# Restore from backup
mongorestore --db b2bconnect /backups/b2bconnect_20240615
```

### Backup Automation (Cron)
```bash
# Edit crontab
crontab -e

# Add daily backup job (3 AM)
0 3 * * * mongodump --db b2bconnect --out /backups/b2bconnect_$(date +\%Y\%m\%d)
```

---

## Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups automated
- [ ] Monitoring alerts configured
- [ ] Log rotation setup
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] JWT secrets strong and unique
- [ ] Database indexes created
- [ ] Cache layer configured
- [ ] CDN configured for static files
- [ ] Load balancer configured
- [ ] Firewall rules configured
- [ ] Security headers enabled
- [ ] Error tracking (Sentry) configured

---

## Performance Metrics

### Expected Performance

| Metric | Target |
|--------|--------|
| API Response Time (p95) | <200ms |
| Database Query Time | <50ms |
| Dashboard Load Time | <2s |
| Concurrent Users | 10,000+ |
| Monthly Visits | 1,000,000+ |
| Uptime SLA | 99.9% |

---

## Support & Documentation

**Documentation Location:** `d:\Distributor\B2BConnect\docs\`

**Files:**
- `SALESMAN_MODULE_GUIDE.md` - Complete feature guide
- `API_SPECIFICATION.md` - API endpoints and examples
- `PRD_USER_STORIES.md` - Product requirements
- `DEPLOYMENT.md` - This file

**Support Channels:**
- Documentation: See above files
- Issue Tracking: GitHub Issues
- Email: support@b2bconnect.com

---

## Version Information

- **Version:** 1.0.0
- **Release Date:** June 2026
- **Node.js:** 20.x LTS
- **MongoDB:** 5.0+
- **Angular:** 22.x
- **Ionic:** 8.x

---

## License

All code copyright B2BConnect © 2026. Proprietary and confidential.

