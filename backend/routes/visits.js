const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getVisits,
  getVisit,
  createVisit,
} = require('../controllers/visitsController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin', 'salesman']), getVisits);

router.get('/:id', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin', 'salesman']), getVisit);

router.post('/', authenticate, ensureTenant, authorize(['salesman']), createVisit);

module.exports = router;
