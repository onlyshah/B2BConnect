const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getRetailers,
  getRetailer,
  createRetailer,
  updateRetailer,
  approveRetailer,
  deleteRetailer,
} = require('../controllers/retailerController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getRetailers);

router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), createRetailer);

router.get('/:retailerId', authenticate, ensureTenant, getRetailer);

router.put('/:retailerId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), updateRetailer);

router.post('/:retailerId/approve', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), approveRetailer);

router.delete('/:retailerId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), deleteRetailer);

module.exports = router;
