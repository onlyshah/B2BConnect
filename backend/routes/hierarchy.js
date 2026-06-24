const express = require('express');
const { authenticate, ensureTenant } = require('../middleware/auth');
const { buildVisibilityFilter, getRoleContext } = require('../middleware/ownership');

const router = express.Router();

router.get('/context', authenticate, ensureTenant, (req, res) => {
  res.json({ success: true, data: getRoleContext(req) });
});

router.get('/visibility', authenticate, ensureTenant, (req, res) => {
  res.json({
    success: true,
    data: {
      role: req.user.role,
      filters: {
        orders: buildVisibilityFilter(req, req.user.role, 'order'),
        retailers: buildVisibilityFilter(req, req.user.role, 'retailer'),
        salesmen: buildVisibilityFilter(req, req.user.role, 'salesman'),
        distributors: buildVisibilityFilter(req, req.user.role, 'distributor'),
      }
    }
  });
});

module.exports = router;
