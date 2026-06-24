const express = require('express');
const { authenticate, ensureTenant } = require('../middleware/auth');
const {
  getReviews,
  createReview,
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getReviews);

router.post('/', authenticate, ensureTenant, createReview);

module.exports = router;
