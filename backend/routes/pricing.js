const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getPrices,
  createPrice,
  updatePrice,
} = require('../controllers/pricingController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getPrices);

router.post(
  '/',
  authenticate,
  ensureTenant,
  authorize(['super-admin', 'company-admin', 'distributor-admin']),
  createPrice
);

router.put(
  '/:priceId',
  authenticate,
  ensureTenant,
  authorize(['super-admin', 'company-admin', 'distributor-admin']),
  updatePrice
);

module.exports = router;
