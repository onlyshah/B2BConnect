# Salesman Module - API Specification

## Base URL
```
http://localhost:4000/api
```

## Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer {JWT_TOKEN}
X-Tenant-Id: {TENANT_ID}
```

---

## Salesmen Endpoints

### 1. Get All Salesmen
```http
GET /salesmen
```

**Query Parameters:**
- `status` (optional): 'active' | 'inactive' | 'on-leave'
- `territory` (optional): territory name

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "name": "Rajesh Kumar",
    "email": "rajesh@company.com",
    "phone": "9876543210",
    "territory": "North Mumbai",
    "status": "active",
    "dailyVisitTarget": 20,
    "totalVisits": 150,
    "totalOrders": 45,
    "totalRevenue": 450000,
    "performanceScore": 85
  }
]
```

### 2. Get Specific Salesman
```http
GET /salesmen/{id}
```

**Response (200):**
```json
{
  "_id": "ObjectId",
  "name": "Rajesh Kumar",
  "email": "rajesh@company.com",
  "phone": "9876543210",
  "territory": "North Mumbai",
  "assignedDistributors": [
    { "_id": "ObjectId", "name": "Distributor A" }
  ],
  "assignedRetailers": [
    { "_id": "ObjectId", "name": "Retail Store 1" }
  ],
  "productCategories": ["FMCG", "Beverages"],
  "dailyVisitTarget": 20,
  "performanceScore": 85,
  "totalVisits": 150,
  "totalOrders": 45,
  "totalRevenue": 450000,
  "retailersAdded": 8
}
```

### 3. Create Salesman
```http
POST /salesmen
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@company.com",
  "phone": "9876543210",
  "employeeId": "EMP001",
  "territory": "North Mumbai",
  "dailyVisitTarget": 20,
  "manager": "ObjectId"
}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "name": "Rajesh Kumar",
  "email": "rajesh@company.com",
  "status": "active",
  "totalVisits": 0,
  "totalOrders": 0,
  "totalRevenue": 0
}
```

### 4. Update Salesman
```http
PATCH /salesmen/{id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "phone": "9876543211",
  "territory": "South Mumbai",
  "status": "inactive",
  "dailyVisitTarget": 25
}
```

**Response (200):**
```json
{
  "_id": "ObjectId",
  "name": "Rajesh Kumar",
  "territory": "South Mumbai",
  "status": "inactive"
}
```

### 5. Delete Salesman
```http
DELETE /salesmen/{id}
```

**Response (200):**
```json
{
  "message": "Salesman deleted"
}
```

### 6. Get Salesman Dashboard
```http
GET /salesmen/{id}/dashboard
```

**Response (200):**
```json
{
  "totalVisits": 150,
  "totalOrders": 45,
  "totalRevenue": 450000,
  "retailersAdded": 8,
  "performanceScore": 85,
  "territories": "North Mumbai",
  "retailers": 25
}
```

---

## Visits Endpoints

### 1. Get All Visits
```http
GET /visits
```

**Query Parameters:**
- `salesman` (optional): salesman ObjectId
- `retailer` (optional): retailer ObjectId
- `status` (optional): 'completed' | 'pending' | 'cancelled'
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "salesman": {
      "_id": "ObjectId",
      "name": "Rajesh Kumar"
    },
    "retailer": {
      "_id": "ObjectId",
      "name": "Retail Store 1",
      "storeName": "ABC Mart"
    },
    "visitDate": "2024-06-15",
    "purpose": "order-collection",
    "visitOutcome": "order-placed",
    "status": "completed",
    "retailerInterest": "high",
    "geoLocation": {
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  }
]
```

### 2. Get Specific Visit
```http
GET /visits/{id}
```

**Response (200):**
```json
{
  "_id": "ObjectId",
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "distributor": "ObjectId",
  "visitDate": "2024-06-15",
  "checkInTime": "2024-06-15T09:30:00Z",
  "checkOutTime": "2024-06-15T10:15:00Z",
  "duration": 45,
  "purpose": "order-collection",
  "discussionNotes": "Good stock levels, discussed new products",
  "productsDiscussed": [
    { "productId": "ObjectId", "name": "Product A", "quantity": 50 }
  ],
  "competitorProducts": [
    { "brand": "Competitor X", "product": "Product Y", "price": 100 }
  ],
  "retailerInterest": "high",
  "followUpDate": "2024-06-20",
  "visitOutcome": "order-placed",
  "geoLocation": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "accuracy": 10
  },
  "status": "completed"
}
```

### 3. Create Visit
```http
POST /visits
Content-Type: application/json
```

**Request Body:**
```json
{
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "distributor": "ObjectId",
  "visitDate": "2024-06-15",
  "purpose": "order-collection",
  "discussionNotes": "Good stock levels",
  "productsDiscussed": [
    { "productId": "ObjectId", "name": "Product A", "quantity": 50 }
  ],
  "retailerInterest": "high",
  "followUpDate": "2024-06-20",
  "visitOutcome": "order-placed",
  "geoLocation": {
    "latitude": 19.0760,
    "longitude": 72.8777
  }
}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "visitDate": "2024-06-15",
  "status": "pending"
}
```

### 4. Update Visit
```http
PATCH /visits/{id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "checkInTime": "2024-06-15T09:30:00Z",
  "checkOutTime": "2024-06-15T10:15:00Z",
  "status": "completed",
  "discussionNotes": "Updated notes"
}
```

**Response (200):**
```json
{
  "_id": "ObjectId",
  "duration": 45,
  "status": "completed"
}
```

### 5. Get Today's Visits
```http
GET /visits/salesman/{salesmanId}/today
```

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "retailer": "Retail Store 1",
    "purpose": "order-collection",
    "status": "completed"
  }
]
```

---

## Orders Endpoints

### 1. Get All Orders
```http
GET /salesman-orders
```

**Query Parameters:**
- `salesman` (optional): salesman ObjectId
- `retailer` (optional): retailer ObjectId
- `status` (optional): status value

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "orderId": "SO-1687891200000",
    "salesman": { "name": "Rajesh Kumar" },
    "retailer": { "name": "Retail Store 1" },
    "items": [
      { "product": "ObjectId", "quantity": 100, "price": 50, "total": 5000 }
    ],
    "total": 5900,
    "status": "submitted"
  }
]
```

### 2. Create Order
```http
POST /salesman-orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "distributor": "ObjectId",
  "items": [
    { "product": "ObjectId", "quantity": 100, "price": 50 }
  ],
  "paymentMode": "cash",
  "deliveryDate": "2024-06-16"
}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "orderId": "SO-1687891200000",
  "total": 5900,
  "status": "draft"
}
```

### 3. Submit Order
```http
POST /salesman-orders/{id}/submit
```

**Response (200):**
```json
{
  "_id": "ObjectId",
  "status": "submitted"
}
```

---

## Retailer Scoring Endpoints

### 1. Get All Scores
```http
GET /retailer-scores
```

**Query Parameters:**
- `potential`: 'high' | 'medium' | 'low'
- `minScore`: minimum score
- `maxScore`: maximum score

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "retailer": { "name": "Retail Store 1" },
    "salesPotential": 85,
    "productInterest": 75,
    "paymentReliability": 90,
    "marketLocation": 80,
    "overallScore": 82.5,
    "potential": "high"
  }
]
```

### 2. Create/Update Score
```http
POST /retailer-scores
Content-Type: application/json
```

**Request Body:**
```json
{
  "retailer": "ObjectId",
  "salesman": "ObjectId",
  "salesPotential": 85,
  "storeSize": "medium",
  "productInterest": 75,
  "paymentReliability": 90,
  "marketLocation": 80,
  "estimatedMonthlyTurnover": 500000
}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "overallScore": 82.5,
  "potential": "high"
}
```

---

## Competitor Reports Endpoints

### 1. Get All Reports
```http
GET /competitor-reports
```

**Query Parameters:**
- `brand`: competitor brand name (regex search)
- `salesman`: salesman ObjectId
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "competitorBrand": "Brand X",
    "competitorProduct": "Product Y",
    "retailPrice": 150,
    "marketTrend": "increasing",
    "retailerFeedback": "Good quality, competitive price"
  }
]
```

### 2. Create Report
```http
POST /competitor-reports
Content-Type: application/json
```

**Request Body:**
```json
{
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "visit": "ObjectId",
  "competitorBrand": "Brand X",
  "competitorProduct": "Product Y",
  "retailPrice": 150,
  "marketTrend": "increasing",
  "retailerFeedback": "Good quality"
}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "competitorBrand": "Brand X"
}
```

### 3. Get Market Summary
```http
GET /competitor-reports/market/summary
```

**Response (200):**
```json
{
  "totalCompetitors": 15,
  "totalReports": 250,
  "marketTrends": {
    "increasing": 80,
    "stable": 120,
    "decreasing": 50
  },
  "topCompetitors": ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"]
}
```

---

## Performance Endpoints

### 1. Get Performance Data
```http
GET /performance
```

**Query Parameters:**
- `salesman`: salesman ObjectId
- `month`: month name
- `year`: year

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "salesman": { "name": "Rajesh Kumar" },
    "month": "June",
    "year": 2024,
    "performanceScore": 85,
    "rating": "excellent",
    "kpis": {
      "visitsCompleted": { "target": 440, "actual": 420, "achievement": 95 },
      "ordersGenerated": { "target": 40, "actual": 45 },
      "revenueGenerated": { "target": 500000, "actual": 525000 }
    }
  }
]
```

### 2. Calculate Performance
```http
POST /performance/calculate/{salesmanId}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "performanceScore": 85,
  "rating": "excellent",
  "kpis": {
    "visitsCompleted": { "actual": 420 },
    "ordersGenerated": { "actual": 45 },
    "revenueGenerated": { "actual": 525000 }
  }
}
```

---

## Follow-Ups Endpoints

### 1. Get Pending Follow-Ups
```http
GET /followups/salesman/{salesmanId}/pending
```

**Response (200):**
```json
[
  {
    "_id": "ObjectId",
    "retailer": { "name": "Retail Store 1" },
    "reason": "order-follow-up",
    "priority": "high",
    "followUpDate": "2024-06-20"
  }
]
```

### 2. Create Follow-Up
```http
POST /followups
Content-Type: application/json
```

**Request Body:**
```json
{
  "salesman": "ObjectId",
  "retailer": "ObjectId",
  "followUpDate": "2024-06-20",
  "reason": "order-follow-up",
  "priority": "high"
}
```

**Response (201):**
```json
{
  "_id": "ObjectId",
  "status": "pending"
}
```

### 3. Complete Follow-Up
```http
PATCH /followups/{id}/complete
Content-Type: application/json
```

**Request Body:**
```json
{
  "completionNotes": "Order confirmed",
  "outcome": "order-placed"
}
```

**Response (200):**
```json
{
  "_id": "ObjectId",
  "status": "completed",
  "completionDate": "2024-06-20"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied - insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per minute

---

## Testing with cURL

```bash
# Get all salesmen
curl -X GET http://localhost:4000/api/salesmen \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Tenant-Id: YOUR_TENANT_ID"

# Create visit
curl -X POST http://localhost:4000/api/visits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Tenant-Id: YOUR_TENANT_ID" \
  -d '{
    "salesman": "ObjectId",
    "retailer": "ObjectId",
    "purpose": "order-collection"
  }'
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error |

