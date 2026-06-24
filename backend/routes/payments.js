const express = require('express');
const { authenticate, ensureTenant, authorize } = require('../middleware/auth');
const {
  getPayments,
  getPayment,
  createPayment,
} = require('../controllers/paymentController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getPayments);

router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), createPayment);

router.get('/:paymentId', authenticate, ensureTenant, getPayment);

module.exports = router;
