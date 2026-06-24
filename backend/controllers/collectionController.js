const CollectionRecord = require('../models/CollectionRecord');
const Retailer = require('../models/Retailer');

// Get all collections
const getCollections = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { retailer, status, startDate, endDate } = req.query;

    const filter = { tenantId: req.tenantId };
    if (retailer) filter.retailer = retailer;
    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.collectionDate = {};
      if (startDate) filter.collectionDate.$gte = new Date(startDate);
      if (endDate) filter.collectionDate.$lte = new Date(endDate);
    }

    const collections = await CollectionRecord.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ collectionDate: -1 })
      .populate('retailer')
      .populate('distributor');

    const total = await CollectionRecord.countDocuments(filter);

    res.json({
      success: true,
      data: collections,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single collection
const getCollection = async (req, res) => {
  try {
    const collection = await CollectionRecord.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    })
      .populate('retailer')
      .populate('distributor')
      .populate('collectedBy');

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create collection
const createCollection = async (req, res) => {
  try {
    const { retailer, distributor, amountCollected, paymentMode, referenceId } = req.body;

    if (!retailer || !distributor || !amountCollected) {
      return res.status(400).json({
        success: false,
        message: 'retailer, distributor, and amountCollected are required',
      });
    }

    const retailerDoc = await Retailer.findById(retailer);
    if (!retailerDoc) {
      return res.status(400).json({ success: false, message: 'Retailer not found' });
    }

    const balanceBefore = retailerDoc.outstandingBalance || 0;
    const balanceAfter = Math.max(0, balanceBefore - amountCollected);

    const collectionId = `COL-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

    const collection = new CollectionRecord({
      tenantId: req.tenantId,
      collectionId,
      retailer,
      distributor,
      amountCollected,
      paymentMode,
      referenceId,
      balanceBefore,
      balanceAfter,
      status: 'recorded',
    });

    await collection.save();
    await collection.populate('retailer');
    await collection.populate('distributor');

    // Update retailer balance
    retailerDoc.outstandingBalance = balanceAfter;
    await retailerDoc.save();

    res.status(201).json({
      success: true,
      data: collection,
      message: 'Collection recorded',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCollections,
  getCollection,
  createCollection,
};
