const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getReturns,
  getReturn,
  createReturn,
  updateReturnStatus,
  deleteReturn,
} = require('../controllers/returnController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getReturns);

router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), createReturn);

router.get('/:returnId', authenticate, ensureTenant, getReturn);

router.put('/:returnId/status', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), updateReturnStatus);

router.delete('/:returnId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), deleteReturn);

module.exports = router;
