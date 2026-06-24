const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getCompetitorReports,
  getCompetitorReport,
  createCompetitorReport,
} = require('../controllers/competitorReportController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin', 'salesman']), getCompetitorReports);

router.get('/:id', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin', 'salesman']), getCompetitorReport);

router.post('/', authenticate, ensureTenant, authorize(['salesman']), createCompetitorReport);

module.exports = router;
