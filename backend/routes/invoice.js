const express = require('express');
const { authenticate, ensureTenant, authorize } = require('../middleware/auth');
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  getOutstandingSummary,
  markInvoiceAsPaid,
  deleteInvoice,
} = require('../controllers/invoiceController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getInvoices);

router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), createInvoice);

router.get('/summary/outstanding', authenticate, ensureTenant, getOutstandingSummary);

router.get('/:invoiceId', authenticate, ensureTenant, getInvoice);

router.put('/:invoiceId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), updateInvoice);

router.post('/:invoiceId/mark-paid', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin']), markInvoiceAsPaid);

router.delete('/:invoiceId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), deleteInvoice);

module.exports = router;
