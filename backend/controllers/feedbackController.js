const SalesmanFeedback = require('../models/SalesmanFeedback');

const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

const buildFilter = (req, extra = {}) => ({
  companyId: resolveCompanyId(req),
  ...extra,
});

const getFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = buildFilter(req);
    if (req.query.salesmanId) filter.salesmanId = req.query.salesmanId;
    if (req.query.retailerId) filter.retailerId = req.query.retailerId;
    if (req.query.feedbackType) filter.feedbackType = req.query.feedbackType;

    const feedback = await SalesmanFeedback.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('salesmanId')
      .populate('retailerId');

    const total = await SalesmanFeedback.countDocuments(filter);

    res.json({
      success: true,
      data: feedback,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      message: 'Get feedback list',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const item = await SalesmanFeedback.findOne({
      _id: req.params.id,
      ...buildFilter(req),
    }).populate('salesmanId').populate('retailerId');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    res.json({
      success: true,
      data: item,
      message: 'Get feedback',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { salesmanId, retailerId, feedback, category } = req.body;

    if (!salesmanId || !retailerId || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'salesmanId, retailerId, and feedback are required',
      });
    }

    const item = new SalesmanFeedback({
      companyId: resolveCompanyId(req),
      salesmanId,
      retailerId,
      feedbackType: category || 'general',
      feedbackText: feedback,
    });

    await item.save();
    await item.populate('salesmanId');
    await item.populate('retailerId');

    res.status(201).json({
      success: true,
      data: item,
      message: 'Feedback created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFeedback,
  getFeedbackById,
  createFeedback,
};
