const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const { getCampaigns, createCampaign, updateCampaign, deleteCampaign } = require('../controllers/campaignController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), getCampaigns);
router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), createCampaign);
router.put('/:campaignId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), updateCampaign);
router.delete('/:campaignId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), deleteCampaign);

module.exports = router;
