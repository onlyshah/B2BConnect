const express = require('express');
const { authenticate, ensureTenant } = require('../middleware/auth');
const {
  getDashboard,
  getDashboardWidgets,
} = require('../controllers/dashboardController');
const { getSummary } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getDashboard);
router.get('/summary', authenticate, ensureTenant, getSummary);
router.get('/widgets', authenticate, ensureTenant, getDashboardWidgets);

module.exports = router;
