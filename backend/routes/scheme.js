const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const { getSchemes, createScheme, updateScheme, deleteScheme } = require('../controllers/schemeController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), getSchemes);
router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), createScheme);
router.put('/:schemeId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), updateScheme);
router.delete('/:schemeId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), deleteScheme);

module.exports = router;
