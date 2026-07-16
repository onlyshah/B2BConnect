const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const fallbackState = {
  users: [],
  companies: [],
  distributors: [],
  retailers: [],
  orders: [],
};

const fallbackAuthSecret = process.env.JWT_SECRET || 'dev-secret';
const fallbackRefreshSecret = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret';

const buildAuthUser = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  tenantId: user.tenantId,
  companyId: user.companyId,
  distributorId: user.distributorId,
  retailerId: user.retailerId,
  salesmanId: user.salesmanId,
});

const createTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id || user.id,
      tenantId: user.tenantId,
      role: user.role,
      companyId: user.companyId,
      distributorId: user.distributorId,
      retailerId: user.retailerId,
      salesmanId: user.salesmanId,
      email: user.email,
      tokenVersion: user.refreshTokenVersion || 0,
    },
    fallbackAuthSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id || user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
      tokenVersion: user.refreshTokenVersion || 0,
    },
    fallbackRefreshSecret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

const successResponse = (res, { status = 200, message = 'Success', data = null, meta = {} } = {}) => {
  return res.status(status).json({ success: true, message, data, meta, errors: [] });
};

const errorResponse = (res, { status = 400, message = 'Validation failed', data = null, errors = [] } = {}) => {
  return res.status(status).json({ success: false, message, data, errors });
};

const initFallbackState = async () => {
  const tenantId = '000000000000000000000001';
  const passwordHash = await bcryptjs.hash('User@2026', 10);
  const superAdminPasswordHash = await bcryptjs.hash('B2BConnect@2026', 10);

  const company = {
    _id: 'company-1',
    tenantId,
    name: 'Arrvi',
    legalName: 'Arrvi Technologies',
    email: 'info@arrvi.com',
    phone: '+91-9876543200',
    status: 'active',
    companyType: 'enterprise',
  };

  const distributor = {
    _id: 'distributor-1',
    tenantId,
    companyId: company._id,
    name: 'Arrvi Distribution',
    email: 'dist@arrvi.com',
    phone: '+91-9876543211',
    status: 'active',
  };

  const retailer = {
    _id: 'retailer-1',
    tenantId,
    companyId: company._id,
    distributorId: distributor._id,
    name: 'Retailer One',
    storeName: 'Arrvi Retail',
    phone: '+91-9876543299',
    location: { city: 'Delhi', state: 'Delhi' },
    status: 'active',
  };

  const users = [
    {
      _id: 'local-company-admin',
      tenantId,
      companyId: company._id,
      distributorId: null,
      retailerId: null,
      salesmanId: null,
      name: `${company.name} Operations Head`,
      email: 'admin@arrvi.com',
      phone: '+91-9876543250',
      passwordHash,
      role: 'company-admin',
      status: 'active',
      refreshTokenVersion: 0,
    },
    {
      _id: 'local-retailer',
      tenantId,
      companyId: company._id,
      distributorId: distributor._id,
      retailerId: retailer._id,
      salesmanId: null,
      name: `${retailer.name} Store Owner`,
      email: 'retailer@arrvi.com',
      phone: '+91-9876543299',
      passwordHash,
      role: 'retailer',
      status: 'active',
      refreshTokenVersion: 0,
    },
    {
      _id: 'local-super-admin',
      tenantId,
      companyId: company._id,
      distributorId: null,
      retailerId: null,
      salesmanId: null,
      name: 'System Administrator',
      email: 'admin@b2bconnect.in',
      phone: '+91-9876543260',
      passwordHash: superAdminPasswordHash,
      role: 'super-admin',
      status: 'active',
      refreshTokenVersion: 0,
    },
  ];

  fallbackState.users = users;
  fallbackState.companies = [company];
  fallbackState.distributors = [distributor];
  fallbackState.retailers = [retailer];
  fallbackState.orders = [{
    _id: 'order-1',
    tenantId,
    companyId: company._id,
    distributorId: distributor._id,
    retailerId: retailer._id,
    status: 'delivered',
    totalAmount: 2500,
    createdAt: new Date(),
  }];
};

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/b2bconnect';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (err) {
    console.warn('MongoDB unavailable, using local fallback data.');
  }
};

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  if (req.path === '/health') {
    return res.json({ status: 'ok' });
  }

  if (req.path === '/api/auth/login' && req.method === 'POST') {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return errorResponse(res, { status: 400, message: 'Email and password required' });
    }

    const user = fallbackState.users.find((candidate) => candidate.email === String(email).toLowerCase());
    if (!user || !(await bcryptjs.compare(String(password), user.passwordHash))) {
      return errorResponse(res, { status: 401, message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = createTokens(user);
    return res.json({ accessToken, refreshToken, user: buildAuthUser(user) });
  }

  if (req.path === '/api/auth/refresh' && req.method === 'POST') {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return errorResponse(res, { status: 400, message: 'Refresh token required' });
    }

    try {
      const decoded = jwt.verify(refreshToken, fallbackRefreshSecret);
      const user = fallbackState.users.find((candidate) => candidate._id === decoded.userId || candidate.email === decoded.email);
      if (!user) {
        return errorResponse(res, { status: 401, message: 'Invalid refresh token' });
      }
      const tokens = createTokens(user);
      return res.json(tokens);
    } catch (err) {
      return errorResponse(res, { status: 401, message: 'Invalid refresh token' });
    }
  }

  if (req.path === '/api/auth/logout' && req.method === 'POST') {
    return res.json({ message: 'Logged out' });
  }

  if (req.path === '/api/auth/me' && req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, fallbackAuthSecret);
      const user = fallbackState.users.find((candidate) => candidate._id === decoded.userId || candidate.email === decoded.email);
      if (!user) {
        return errorResponse(res, { status: 401, message: 'Unauthorized' });
      }
      return successResponse(res, { data: buildAuthUser(user) });
    } catch (err) {
      return errorResponse(res, { status: 401, message: 'Unauthorized' });
    }
  }

  if (req.path === '/api/dashboard/summary' && req.method === 'GET') {
    return successResponse(res, {
      data: {
        products: 12,
        distributors: fallbackState.distributors.length,
        retailers: { active: fallbackState.retailers.length, pendingApproval: 0 },
        orders: { pending: 0, delivered: fallbackState.orders.length },
        finance: { openInvoices: 0, outstandingAmount: 0 },
        inventory: { lowStock: 0 },
        workflows: { pendingSamples: 0, openReturns: 0 },
        discovery: { publishedStories: 0, averageRating: 0 },
        campaigns: { active: 0 },
        schemes: { active: 0 },
      },
    });
  }

  if (req.path === '/api/companies' && req.method === 'GET') {
    return successResponse(res, { data: fallbackState.companies, meta: { page: 1, limit: 10, total: fallbackState.companies.length, pages: 1 } });
  }

  if (req.path === '/api/distributors' && req.method === 'GET') {
    return successResponse(res, { data: fallbackState.distributors, meta: { page: 1, limit: 10, total: fallbackState.distributors.length, pages: 1 } });
  }

  if (req.path === '/api/retailers' && req.method === 'GET') {
    return successResponse(res, { data: fallbackState.retailers, meta: { page: 1, limit: 10, total: fallbackState.retailers.length, pages: 1 } });
  }

  if (req.path === '/api/orders' && req.method === 'GET') {
    return successResponse(res, { data: fallbackState.orders, meta: { page: 1, limit: 10, total: fallbackState.orders.length, pages: 1 } });
  }

  return next();
});

initFallbackState();
connectDatabase();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/company'));
app.use('/api/products', require('./routes/product'));
app.use('/api/distributors', require('./routes/distributor'));
app.use('/api/retailers', require('./routes/retailer'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/samples', require('./routes/sample'));
app.use('/api/invoices', require('./routes/invoice'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/installments', require('./routes/installments'));
app.use('/api/returns', require('./routes/returns'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/stories', require('./routes/story'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/territories', require('./routes/territory'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/hierarchy', require('./routes/hierarchy'));
app.use('/api/campaigns', require('./routes/campaign'));
app.use('/api/schemes', require('./routes/scheme'));

// Salesman Module Routes
app.use('/api/salesmen', require('./routes/salesman'));
app.use('/api/visits', require('./routes/visits'));
app.use('/api/salesman-orders', require('./routes/salesman-orders'));
app.use('/api/retailer-scores', require('./routes/retailer-scores'));
app.use('/api/competitor-reports', require('./routes/competitor-reports'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/followups', require('./routes/followups'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/attendance', require('./routes/attendance'));

// Dashboard Route
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`B2BConnect backend running on port ${PORT}`);
});

module.exports = app;
