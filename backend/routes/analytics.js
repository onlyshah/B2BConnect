const express = require('express');
const { authenticate, ensureTenant } = require('../middleware/auth');
const {
  getSummary,
  getSalesPerformance,
  getInventoryPerformance,
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/summary', authenticate, ensureTenant, getSummary);

router.get('/sales-performance', authenticate, ensureTenant, getSalesPerformance);

router.get('/inventory-performance', authenticate, ensureTenant, getInventoryPerformance);

module.exports = router;
