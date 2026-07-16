const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getCollections,
  getCollection,
  createCollection,
} = require('../controllers/collectionController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin', 'distributor-staff']), getCollections);

router.get('/:id', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin', 'distributor-staff']), getCollection);

router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin', 'distributor-admin', 'distributor-staff', 'salesman']), createCollection);

module.exports = router;
