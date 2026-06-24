const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getFeedback,
  getFeedbackById,
  createFeedback,
} = require('../controllers/feedbackController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin']), getFeedback);

router.get('/:id', authenticate, ensureTenant, authorize(['company-admin', 'distributor-admin']), getFeedbackById);

router.post('/', authenticate, ensureTenant, authorize(['retailer', 'salesman']), createFeedback);

module.exports = router;
