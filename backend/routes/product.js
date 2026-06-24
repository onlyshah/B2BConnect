const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// Get all products
router.get('/', authenticate, ensureTenant, getProducts);

// Create product
router.post('/', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), createProduct);

// Get single product
router.get('/:productId', authenticate, ensureTenant, getProduct);

// Update product
router.put('/:productId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), updateProduct);

// Delete product
router.delete('/:productId', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), deleteProduct);

// Upload product image
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/:productId/upload-image', authenticate, ensureTenant, authorize(['super-admin', 'company-admin']), upload.single('file'), require('../controllers/productController').uploadImage);

module.exports = router;
