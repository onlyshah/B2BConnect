const http = require('http');

const API_URL = 'http://localhost:4000/api';
const TENANT_ID = '000000000000000000000001';
const CREDENTIALS = { email: 'admin@arrvi.com', password: 'User@2026' };

function request(method, path, body = null, token = null, tenantOverride = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': tenantOverride || TENANT_ID
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        if (data) {
          try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
        }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  try {
    console.log('Logging in...');
    const login = await request('POST', '/auth/login', CREDENTIALS);
    console.log('Login status:', login.status);
    if (login.status !== 200) {
      console.error('Login failed:', login.body);
      return;
    }

    const token = login.body.accessToken || login.body.token;
    if (!token) {
      console.error('No access token returned');
      return;
    }

    console.log('Fetching salesmen list...');
    const salesmen = await request('GET', '/salesmen', null, token);
    console.log('Salesmen status:', salesmen.status);
    const list = salesmen.body?.data || salesmen.body;
      let firstId = null;
      if (Array.isArray(salesmen.body?.data) && salesmen.body.data.length > 0) {
        firstId = salesmen.body.data[0]._id || salesmen.body.data[0].id;
      }

      if (!firstId) {
        // Fallback: query MongoDB directly to find any salesman
        console.log('No salesmen returned by API; querying MongoDB directly for a salesman id...');
        const mongoose = require('mongoose');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/b2bconnect');
        const Salesman = require('./models/Salesman');
        const any = await Salesman.findOne().lean();
        await mongoose.disconnect();
        if (!any) {
          console.error('No salesman records found in database');
          return;
        }
        firstId = any._id;
        const tenantHeader = any.tenantId?.toString ? any.tenantId.toString() : any.tenantId;
        console.log('Found salesman in DB:', firstId, 'tenantId:', tenantHeader);
        const perf = await request('GET', `/salesmen/${firstId}/performance`, null, token, tenantHeader);
        console.log('Performance status:', perf.status);
        console.log('Performance body:', JSON.stringify(perf.body, null, 2));
        return;
      }

      // If we still don't have a salesman id from the API, query MongoDB directly
      if (!firstId) {
        console.log('Querying MongoDB directly for a salesman id...');
        const mongoose = require('mongoose');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/b2bconnect');
        const Salesman = require('./models/Salesman');
        const any = await Salesman.findOne().lean();
        await mongoose.disconnect();
        if (!any) {
          console.error('No salesman records found in database');
          return;
        }
        firstId = any._id;
        const tenantHeader = any.tenantId?.toString ? any.tenantId.toString() : any.tenantId;
        console.log('Found salesman in DB:', firstId, 'tenantId:', tenantHeader);
        const perf = await request('GET', `/salesmen/${firstId}/performance`, null, token, tenantHeader);
        console.log('Performance status:', perf.status);
        console.log('Performance body:', JSON.stringify(perf.body, null, 2));
        return;
      }

      console.log('Using salesman id:', firstId);
      console.log('Requesting performance for salesman:', firstId);
      const perf = await request('GET', `/salesmen/${firstId}/performance`, null, token);
      console.log('Performance status:', perf.status);
      console.log('Performance body:', JSON.stringify(perf.body, null, 2));
  } catch (err) {
    console.error('Error during authenticated test:', err.message);
  }
})();
