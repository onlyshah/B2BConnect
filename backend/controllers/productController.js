const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/response');
const { buildTenantFilter, getPagination, resolveCompanyId } = require('../utils/tenantScope');

const getProducts = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const filter = buildTenantFilter(req);
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Product.countDocuments(filter),
    ]);

    return successResponse(res, {
      message: 'Products retrieved successfully',
      data: products,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId, ...buildTenantFilter(req) }).lean();
    if (!product) return errorResponse(res, { status: 404, message: 'Product not found' });
    return successResponse(res, { message: 'Product retrieved successfully', data: product });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, mrp } = req.body;
    if (!name || !sku || !mrp) {
      return errorResponse(res, { status: 400, message: 'Name, SKU, and MRP are required' });
    }

    const product = new Product({ ...req.body, tenantId: req.tenantId, companyId: resolveCompanyId(req) });
    await product.save();
    return successResponse(res, { status: 201, message: 'Product created successfully', data: product });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, ...buildTenantFilter(req) },
      req.body,
      { new: true }
    );
    if (!product) return errorResponse(res, { status: 404, message: 'Product not found' });
    return successResponse(res, { message: 'Product updated successfully', data: product });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, ...buildTenantFilter(req) },
      { isDeleted: true, deletedAt: new Date(), launchStatus: 'archived' },
      { new: true }
    );
    if (!product) return errorResponse(res, { status: 404, message: 'Product not found' });
    return successResponse(res, { message: 'Product deleted successfully', data: product });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return errorResponse(res, { status: 400, message: 'No file uploaded' });

    const product = await getProductById(req);
    if (!product) return errorResponse(res, { status: 404, message: 'Product not found' });

    product.images = product.images || [];
    product.images.push({ url: `/uploads/products/${req.file.filename}`, filename: req.file.filename, uploadedAt: new Date() });
    await Product.findByIdAndUpdate(req.params.productId, { images: product.images }, { new: true });

    return successResponse(res, { message: 'Image uploaded successfully', data: product });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadImage };
