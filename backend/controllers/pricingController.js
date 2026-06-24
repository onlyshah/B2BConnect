const DistributorProductPrice = require('../models/DistributorProductPrice');
const Retailer = require('../models/Retailer');

const calculateFinalPrice = (price) => {
  const discount =
    price.discountType === 'flat'
      ? price.discountValue
      : (price.basePrice * price.discountValue) / 100;
  return Math.max(price.basePrice - discount, 0);
};

// Get all prices
const getPrices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { distributorId, productId, retailerId } = req.query;

    const filter = { tenantId: req.tenantId, status: 'active' };
    if (distributorId) filter.distributorId = distributorId;
    if (productId) filter.productId = productId;

    let retailerCategory;
    if (retailerId) {
      const retailer = await Retailer.findOne({ _id: retailerId, tenantId: req.tenantId });
      retailerCategory = retailer?.category;
    }

    if (retailerCategory) {
      filter.retailerCategory = { $in: [retailerCategory, 'all'] };
    }

    const prices = await DistributorProductPrice.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ retailerCategory: 1, minQuantity: 1 })
      .populate('distributorId')
      .populate('productId');

    const total = await DistributorProductPrice.countDocuments(filter);

    const pricesWithFinalPrice = prices.map((price) => ({
      ...price.toObject(),
      finalPrice: calculateFinalPrice(price),
    }));

    res.json({
      success: true,
      data: pricesWithFinalPrice,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create price rule
const createPrice = async (req, res) => {
  try {
    const { distributorId, productId, basePrice } = req.body;

    if (!distributorId || !productId || !basePrice) {
      return res.status(400).json({
        success: false,
        message: 'distributorId, productId, and basePrice are required',
      });
    }

    const price = new DistributorProductPrice({
      ...req.body,
      tenantId: req.tenantId,
      status: 'active',
    });

    await price.save();
    await price.populate('distributorId');
    await price.populate('productId');

    res.status(201).json({
      success: true,
      data: { ...price.toObject(), finalPrice: calculateFinalPrice(price) },
      message: 'Price rule created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update price rule
const updatePrice = async (req, res) => {
  try {
    const price = await DistributorProductPrice.findOneAndUpdate(
      { _id: req.params.priceId, tenantId: req.tenantId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )
      .populate('distributorId')
      .populate('productId');

    if (!price) {
      return res.status(404).json({ success: false, message: 'Price rule not found' });
    }

    res.json({
      success: true,
      data: { ...price.toObject(), finalPrice: calculateFinalPrice(price) },
      message: 'Price rule updated',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPrices,
  createPrice,
  updatePrice,
};
