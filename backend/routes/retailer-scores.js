const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getRetailerScores,
  getRetailerScore,
  createRetailerScore,
} = require('../controllers/retailerScoreController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin']), getRetailerScores);

router.get('/:retailerId', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin']), getRetailerScore);

router.post('/', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin']), createRetailerScore);

module.exports = router;
