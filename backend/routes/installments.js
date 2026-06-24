const express = require('express');
const { authenticate, ensureTenant } = require('../middleware/auth');
const {
  getInstallmentPlans,
  createInstallmentPlan,
  updateInstallment,
} = require('../controllers/installmentController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getInstallmentPlans);

router.post('/', authenticate, ensureTenant, createInstallmentPlan);

router.put('/:planId/installments/:installmentIndex', authenticate, ensureTenant, updateInstallment);

module.exports = router;
