const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getSalesmanOrders,
  getSalesmanOrderById,
  createSalesmanOrder,
} = require('../controllers/salesmanOrderController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin', 'salesman']), getSalesmanOrders);

router.get('/:id', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin', 'salesman']), getSalesmanOrderById);

router.post('/', authenticate, ensureTenant, authorize(['salesman']), createSalesmanOrder);

module.exports = router;
