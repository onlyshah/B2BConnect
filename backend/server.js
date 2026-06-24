const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

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
