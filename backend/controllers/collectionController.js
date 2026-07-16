const Collection = require('../models/CollectionRecord');
const { successResponse, errorResponse } = require('../utils/response');
const { buildTenantFilter, getPagination } = require('../utils/tenantScope');

const getCollections = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const filter = buildTenantFilter(req);
    const [collections, total] = await Promise.all([
      Collection.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Collection.countDocuments(filter),
    ]);

    return successResponse(res, {
      message: 'Collections retrieved successfully',
      data: collections,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const getCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({ _id: req.params.collectionId, ...buildTenantFilter(req) }).lean();
    if (!collection) return errorResponse(res, { status: 404, message: 'Collection not found' });
    return successResponse(res, { message: 'Collection retrieved successfully', data: collection });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

const createCollection = async (req, res) => {
  try {
    const collection = new Collection({ ...req.body, tenantId: req.tenantId });
    await collection.save();
    return successResponse(res, { status: 201, message: 'Collection recorded successfully', data: collection });
  } catch (error) {
    return errorResponse(res, { status: 500, message: error.message });
  }
};

module.exports = { getCollections, getCollection, createCollection };
