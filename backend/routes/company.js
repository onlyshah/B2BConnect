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

router.get('/', authenticate, authorize(['super-admin']), getCompanies);

router.post('/', authenticate, authorize(['super-admin']), createCompany);

router.get('/:companyId', authenticate, getCompany);

router.put('/:companyId', authenticate, authorize(['super-admin', 'company-admin']), updateCompany);

router.post('/:companyId/approve', authenticate, authorize(['super-admin']), approveCompany);

router.post('/:companyId/reject', authenticate, authorize(['super-admin']), rejectCompany);

router.delete('/:companyId', authenticate, authorize(['super-admin']), deleteCompany);

module.exports = router;
