const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getFollowups,
  getFollowupById,
  createFollowup,
  updateFollowup,
} = require('../controllers/followupController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin', 'salesman']), getFollowups);

router.get('/:id', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin', 'salesman']), getFollowupById);

router.post('/', authenticate, ensureTenant, authorize(['salesman']), createFollowup);

router.patch('/:id', authenticate, ensureTenant, authorize(['salesman']), updateFollowup);

module.exports = router;
