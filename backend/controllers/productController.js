const Product = require('../models/Product');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

function buildProductFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find(buildProductFilter(req))
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(buildProductFilter(req));
    res.json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId, ...buildProductFilter(req) });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, mrp } = req.body;
    if (!name || !sku || !mrp) {
      return res.status(400).json({ success: false, message: 'Name, SKU, and MRP are required' });
    }

    const product = new Product({
      ...req.body,
      tenantId: req.tenantId,
      companyId: resolveCompanyId(req),
    });

    await product.save();
    res.status(201).json({ success: true, data: product, message: 'Product created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, ...buildProductFilter(req) },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product, message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, ...buildProductFilter(req) },
      { isDeleted: true, deletedAt: new Date(), launchStatus: 'archived' },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const product = await Product.findOne({ _id: req.params.productId, ...buildProductFilter(req) });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.images = product.images || [];
    product.images.push({ url: `/uploads/products/${req.file.filename}`, filename: req.file.filename, uploadedAt: new Date() });
    await product.save();

    res.json({ success: true, data: product, message: 'Image uploaded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadImage };
