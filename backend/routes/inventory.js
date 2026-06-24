const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getInventory,
  getInventoryItem,
  updateInventoryStock,
  getLowStockItems,
} = require('../controllers/inventoryController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getInventory);

router.get('/low-stock', authenticate, ensureTenant, getLowStockItems);

router.get('/:itemId', authenticate, ensureTenant, getInventoryItem);

router.put('/:itemId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), updateInventoryStock);

module.exports = router;
