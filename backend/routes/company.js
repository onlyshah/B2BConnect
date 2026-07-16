const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  approveCompany,
  rejectCompany,
  deleteCompany,
} = require('../controllers/companyController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), getCompanies);

router.post('/', authenticate, ensureTenant, authorize(['super-admin']), createCompany);

router.get('/:companyId', authenticate, ensureTenant, getCompany);

router.put('/:companyId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), updateCompany);

router.post('/:companyId/approve', authenticate, ensureTenant, authorize(['super-admin']), approveCompany);

router.post('/:companyId/reject', authenticate, ensureTenant, authorize(['super-admin']), rejectCompany);

router.delete('/:companyId', authenticate, ensureTenant, authorize(['super-admin']), deleteCompany);

module.exports = router;
