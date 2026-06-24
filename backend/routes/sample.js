const express = require('express');
const { authenticate, ensureTenant } = require('../middleware/auth');
const {
  getSamples,
  getSample,
  createSample,
  updateSample,
  deleteSample,
} = require('../controllers/sampleController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getSamples);

router.post('/', authenticate, ensureTenant, createSample);

router.get('/:sampleId', authenticate, ensureTenant, getSample);

router.put('/:sampleId', authenticate, ensureTenant, updateSample);

router.delete('/:sampleId', authenticate, ensureTenant, deleteSample);

module.exports = router;
