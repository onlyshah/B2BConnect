const Review = require('../models/Review');

// Get all reviews
const getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { productId, retailerId } = req.query;

    const filter = { tenantId: req.tenantId };
    if (productId) filter.productId = productId;
    if (retailerId) filter.retailerId = retailerId;

    const reviews = await Review.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('productId')
      .populate('retailerId');

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create review
const createReview = async (req, res) => {
  try {
    const { productId, retailerId, rating } = req.body;

    if (!productId || !retailerId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'productId, retailerId, and rating are required',
      });
    }

    const review = new Review({
      ...req.body,
      tenantId: req.tenantId,
    });

    await review.save();
    await review.populate('productId');
    await review.populate('retailerId');

    res.status(201).json({ success: true, data: review, message: 'Review created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
};
