const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getTerritories,
  createTerritory,
  updateTerritory,
  deleteTerritory,
} = require('../controllers/territoryController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getTerritories);
router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), createTerritory);
router.put('/:id', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), updateTerritory);
router.delete('/:id', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), deleteTerritory);

module.exports = router;
