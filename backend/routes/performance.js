const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getPerformanceMetrics,
  getSalesmanPerformance,
} = require('../controllers/performanceController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin']), getPerformanceMetrics);

router.get('/salesman/:salesmanId', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin', 'salesman']), getSalesmanPerformance);

module.exports = router;
