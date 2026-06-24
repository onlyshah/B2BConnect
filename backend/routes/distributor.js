const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getDistributors,
  getDistributor,
  createDistributor,
  updateDistributor,
  approveDistributor,
  rejectDistributor,
  deleteDistributor,
} = require('../controllers/distributorController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), getDistributors);

router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), createDistributor);

router.get('/:distributorId', authenticate, ensureTenant, getDistributor);

router.put('/:distributorId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), updateDistributor);

router.post('/:distributorId/approve', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), approveDistributor);

router.post('/:distributorId/reject', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), rejectDistributor);

router.delete('/:distributorId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), deleteDistributor);

module.exports = router;
