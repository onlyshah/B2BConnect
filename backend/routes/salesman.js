const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getSalesmen,
  getSalesman,
  createSalesman,
  updateSalesman,
  assignRetailers,
  assignTerritory,
  getPerformance,
  deleteSalesman,
} = require('../controllers/salesmanController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), getSalesmen);

router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), createSalesman);

router.get('/:salesmanId', authenticate, ensureTenant, getSalesman);

router.put('/:salesmanId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), updateSalesman);

router.post('/:salesmanId/assign-retailers', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), assignRetailers);

router.post('/:salesmanId/assign-territory', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), assignTerritory);

router.get('/:salesmanId/performance', authenticate, ensureTenant, getPerformance);

router.delete('/:salesmanId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), deleteSalesman);

module.exports = router;
