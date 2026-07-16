const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  approveOrder,
  rejectOrder,
  dispatchOrder,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), getOrders);
router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), createOrder);
router.get('/:orderId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), getOrder);
router.put('/:orderId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), updateOrder);
router.post('/:orderId/approve', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), approveOrder);
router.post('/:orderId/reject', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), rejectOrder);
router.post('/:orderId/dispatch', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), dispatchOrder);
router.delete('/:orderId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), deleteOrder);

module.exports = router;
