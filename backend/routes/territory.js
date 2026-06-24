const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getTerritories,
  createTerritory,
} = require('../controllers/territoryController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getTerritories);

router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), createTerritory);

module.exports = router;
