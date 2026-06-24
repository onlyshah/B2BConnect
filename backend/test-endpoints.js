// B2BConnect API Test Script
// Tests core endpoints to ensure backend is working

const http = require('http');

const API_URL = 'http://localhost:4000/api';

// Test helper function
async function testEndpoint(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': 'test-tenant-id'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n=== B2BConnect API Test Suite ===\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await testEndpoint('GET', '/health');
    console.log(`   Status: ${health.status} ${health.status === 200 ? '✓' : '✗'}`);

    // Test 2: Create Product (requires auth - will fail without token)
    console.log('\n2. Testing Product Endpoints...');
    const products = await testEndpoint('GET', '/products');
    console.log(`   GET /products: ${products.status} ${products.status === 200 ? '✓' : '✗'}`);

    // Test 3: Create Order (requires auth)
    console.log('\n3. Testing Order Endpoints...');
    const orders = await testEndpoint('GET', '/orders');
    console.log(`   GET /orders: ${orders.status}`);

    // Test 4: Salesman endpoints
    console.log('\n4. Testing Salesman Endpoints...');
    const salesmen = await testEndpoint('GET', '/salesmen');
    console.log(`   GET /salesmen: ${salesmen.status}`);

    // Test 5: Visits endpoints
    console.log('\n5. Testing Visit Endpoints...');
    const visits = await testEndpoint('GET', '/visits');
    console.log(`   GET /visits: ${visits.status}`);

    // Test 6: Collections endpoints
    console.log('\n6. Testing Collections Endpoints...');
    const collections = await testEndpoint('GET', '/collections');
    console.log(`   GET /collections: ${collections.status}`);

    console.log('\n=== Test Summary ===');
    console.log('✓ All endpoints are responding');
    console.log('Note: Authentication is required for most endpoints.');
    console.log('Use a valid JWT token in Authorization header for full testing.\n');

  } catch (err) {
    console.error('\n✗ Error during testing:', err.message);
    console.log('\nMake sure the backend server is running on http://localhost:4000\n');
  }
}

runTests();
