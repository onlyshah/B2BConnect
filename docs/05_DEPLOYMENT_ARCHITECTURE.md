# B2BConnect Platform - Deployment Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
├──────────────┬──────────────┬──────────────┬─────────────────────┤
│   Company    │  Distributor │   Salesman   │     Retailer        │
│   (Web)      │     (Web)     │   (Mobile)   │     (Mobile/Web)    │
└──────────────┴──────────────┴──────────────┴─────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   CloudFront CDN    │
                    │   (Global Cache)    │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
    ┌────▼────┐          ┌─────▼─────┐         ┌────▼────┐
    │Company  │          │Distributor│         │Salesman │
    │App      │          │App        │         │App      │
    │(Angular)│          │(Angular)  │         │(Ionic)  │
    └────┬────┘          └─────┬─────┘         └────┬────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
         ┌─────────────────────▼─────────────────────┐
         │         AWS API Gateway                   │
         │    (Rate Limiting, Authentication)        │
         └─────────────────────┬─────────────────────┘
                               │
         ┌─────────────────────▼─────────────────────┐
         │      AWS Load Balancer (ALB)              │
         │    (Distribute to backend instances)      │
         └─────────────────────┬─────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
    ┌────▼────┐          ┌─────▼─────┐         ┌────▼────┐
    │Backend  │          │Backend    │         │Backend  │
    │Instance │          │Instance   │         │Instance │
    │(Node.js)│          │(Node.js)  │         │(Node.js)│
    │Port:4000│          │Port:4000  │         │Port:4000│
    └────┬────┘          └─────┬─────┘         └────┬────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
    ┌────▼────┐          ┌─────▼─────┐         ┌────▼────┐
    │ Redis   │          │ MongoDB   │         │  S3     │
    │ Cache   │          │ Database  │         │  Files  │
    │(Sessions)           │           │         │ Storage │
    └─────────┘          └───────────┘         └─────────┘
```

---

## Infrastructure Components

### Frontend Layer

#### 1. Company App (Angular 22)
- **Deployment:** AWS S3 + CloudFront
- **Build:** ng build --configuration production
- **Size:** ~2.5 MB (gzipped)
- **Caching:** 1 hour for index.html, 1 year for assets

#### 2. Distributor App (Angular 22)
- **Deployment:** AWS S3 + CloudFront
- **Build:** ng build --configuration production
- **Size:** ~2.5 MB (gzipped)

#### 3. Salesman App (Ionic + Angular)
- **Deployment Options:**
  - Web: AWS S3 + CloudFront
  - iOS: Apple App Store (via TestFlight in beta)
  - Android: Google Play Store (via Google Play Beta in beta)
- **Web Size:** ~3 MB (gzipped)
- **Native Package:** ~50 MB (APK), ~80 MB (IPA)

#### 4. Retailer App (Ionic + Angular)
- **Deployment Options:** Same as Salesman App

---

### API Layer

#### Backend Servers
- **Framework:** Node.js + Express.js
- **Port:** 4000
- **Instances:** 3-5 (auto-scaling)
- **Load Balancer:** AWS Application Load Balancer (ALB)
- **Health Check:** `/health` endpoint (every 30 seconds)

#### API Gateway
- **AWS API Gateway** for:
  - Rate limiting (100 requests/minute per user)
  - API key management
  - Request validation
  - CORS handling
  - Request/response logging

---

### Database Layer

#### MongoDB
- **Hosting:** MongoDB Atlas or AWS DocumentDB
- **Version:** 5.0+
- **Replica Set:** 3 nodes (High Availability)
- **Automatic Backups:** Daily (30-day retention)
- **Sharding:** Implemented for scale (by company/distributor)
- **Indexes:** 30+ composite indexes for performance

#### Redis Cache
- **Hosting:** AWS ElastiCache
- **Purpose:**
  - Session storage (15-min expiry)
  - API response caching
  - Rate limit counters
  - Real-time notifications queue
- **Memory:** 2 GB (auto-scaling)
- **Eviction Policy:** allkeys-lru

---

### Storage Layer

#### AWS S3
- **Purpose:** Product images, story videos, documents
- **Versioning:** Enabled
- **Server-Side Encryption:** AES-256
- **Lifecycle Policy:** Archive to Glacier after 90 days
- **CloudFront CDN:** Global content delivery

#### AWS RDS (Optional)
- For analytics/reporting database (if needed later)
- PostgreSQL with read replicas

---

## Deployment Environments

### Development
- **URL:** http://localhost:4200 (frontend), http://localhost:4000/api (backend)
- **Database:** Local MongoDB
- **Deployment:** Local machine / Docker

### Staging
- **URL:** https://staging.b2bconnect.com
- **Database:** MongoDB Atlas (staging cluster)
- **Instances:** 1 backend, 1 database, 1 cache
- **Updates:** Auto-deploy on merge to develop branch

### Production
- **URL:** https://b2bconnect.com, https://api.b2bconnect.com
- **Database:** MongoDB Atlas (production cluster with backup)
- **Instances:** 3-5 backend (auto-scaling), 3-node replica set DB
- **CDN:** CloudFront (global)
- **SSL/TLS:** AWS Certificate Manager
- **Updates:** Manual deployments with rollback capability

---

## Deployment Process

### Frontend Deployment

```bash
# 1. Build
ng build --configuration production

# 2. Upload to S3
aws s3 sync dist/app s3://b2bconnect-app --delete

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E123456 --paths "/*"

# 4. Verify
curl https://b2bconnect.com/index.html
```

### Backend Deployment

```bash
# 1. Build Docker image
docker build -t b2bconnect-api:v1.0.0 .

# 2. Push to ECR
aws ecr push-image b2bconnect-api:v1.0.0

# 3. Update ECS task definition
aws ecs register-task-definition --family b2bconnect-api ...

# 4. Deploy to ECS/Kubernetes
kubectl set image deployment/b2bconnect-api \
  b2bconnect-api=b2bconnect-api:v1.0.0

# 5. Health check
curl https://api.b2bconnect.com/health
```

### Mobile App Deployment

#### iOS
```bash
# 1. Build for iOS
ionic build ios --prod

# 2. Archive
xcodebuild -scheme B2BConnect -configuration Release -archivePath \
  build/B2BConnect.xcarchive archive

# 3. Export for App Store
xcodebuild -exportArchive -archivePath build/B2BConnect.xcarchive \
  -exportOptionsPlist options.plist -exportPath export/

# 4. Upload to TestFlight / App Store Connect
```

#### Android
```bash
# 1. Build for Android
ionic build android --prod

# 2. Create signed APK
cd android && ./gradlew assembleRelease
# OR
./gradlew bundleRelease  # For Google Play Bundle

# 3. Upload to Google Play Console / TestFlight
```

---

## Infrastructure as Code

### Terraform Files (for AWS)

**main.tf**
```hcl
# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

# ALB
resource "aws_lb" "main" {
  internal           = false
  load_balancer_type = "application"
  subnets            = aws_subnet.main[*].id
  security_groups    = [aws_security_group.alb.id]
}

# Auto Scaling Group
resource "aws_autoscaling_group" "backend" {
  availability_zones = ["us-east-1a", "us-east-1b"]
  min_size           = 3
  max_size           = 10
  desired_capacity   = 3
}

# MongoDB Atlas
resource "mongodbatlas_cluster" "main" {
  project_id = "..." 
  name       = "b2bconnect-prod"
  num_shards = 1
  
  replication_specs {
    region_configs {
      region_name     = "US_EAST_1"
      electable_nodes = 3
      priority        = 7
    }
  }
}

# S3 Bucket
resource "aws_s3_bucket" "content" {
  bucket = "b2bconnect-content"
  
  versioning {
    enabled = true
  }
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

# CloudFront
resource "aws_cloudfront_distribution" "main" {
  enabled = true
  
  origin {
    domain_name = aws_s3_bucket.content.bucket_regional_domain_name
    origin_id   = "S3"
  }
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "cache" {
  cluster_id           = "b2bconnect-cache"
  engine               = "redis"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  port                 = 6379
}
```

---

## Docker Configuration

**Dockerfile (Backend)**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
```

**docker-compose.yml (Development)**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/b2bconnect
      - REDIS_URI=redis://cache:6379
      - NODE_ENV=development
    depends_on:
      - mongo
      - cache

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  frontend:
    build: ./frontend
    ports:
      - "4200:4200"
    environment:
      - API_URL=http://localhost:4000/api
    depends_on:
      - backend

volumes:
  mongo_data:
```

---

## Monitoring & Logging

### CloudWatch
```javascript
// Log all requests
app.use(expressWinston.logger({
  transports: [
    new winston.transports.CloudWatch({
      logGroupName: '/b2bconnect/backend',
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      messageFormatter: ({level, message, meta}) => {
        return `[${level}] ${message} ${JSON.stringify(meta)}`;
      }
    })
  ]
}));
```

### Sentry (Error Tracking)
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### DataDog (APM & Metrics)
```javascript
const tracer = require('dd-trace').init();

tracer.use('express', {
  enabled: true
});

app.use((req, res, next) => {
  res.on('finish', () => {
    // Track metrics
    datadog.gauge('http.request.duration', Date.now() - req.startTime, {
      path: req.path,
      method: req.method,
      status: res.statusCode
    });
  });
  next();
});
```

### Prometheus (Metrics)
```javascript
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route.path, res.statusCode).observe(duration);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

---

## Scaling Strategy

### Horizontal Scaling
- **Backend:** Auto-scaling group (min: 3, max: 10, target CPU: 70%)
- **Database:** MongoDB sharding by company/distributor
- **Cache:** ElastiCache cluster mode

### Vertical Scaling
- **Database:** Upgrade node types as data grows
- **Cache:** Increase memory allocation
- **Backend:** Upgrade EC2 instance types

### Load Testing
```bash
# Using Apache Bench
ab -n 10000 -c 100 https://api.b2bconnect.com/health

# Using k6
k6 run load-test.js --vus 100 --duration 5m
```

---

## Disaster Recovery

### Backup Strategy
```bash
# Daily MongoDB backup
mongodump --uri "mongodb+srv://..." --out /backup/$(date +%Y%m%d)

# Upload to S3
aws s3 sync /backup s3://b2bconnect-backups --delete

# Retention: 30 days
```

### Recovery Time Objective (RTO)
- **Database:** < 1 hour
- **Application:** < 15 minutes
- **Data:** < 24 hours

### Recovery Point Objective (RPO)
- **Database:** < 1 hour (hourly backups)
- **Application Code:** Immediate (git history)

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time (p95) | <200ms | - |
| Frontend Load Time | <2s | - |
| Mobile App Load Time | <3s | - |
| Database Query Time (p95) | <100ms | - |
| Cache Hit Rate | >80% | - |
| Availability | 99.5% | - |

---

## Cost Estimation (Monthly)

| Service | Usage | Cost |
|---------|-------|------|
| EC2 (3x t3.medium) | 2,160 hours | $300 |
| RDS/MongoDB Atlas | 1TB storage + backup | $500 |
| ElastiCache | 2GB redis | $100 |
| S3 | 100GB storage | $50 |
| CloudFront | 50TB transfer | $400 |
| API Gateway | 1M requests | $50 |
| Lambda (optional) | as needed | $50 |
| **Total** | | **$1,450/month** |

**Note:** Costs scale linearly with usage; enterprise discounts available.

