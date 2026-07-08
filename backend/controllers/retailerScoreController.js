const SalesmanRetailerScore = require('../models/SalesmanRetailerScore');

const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

const buildFilter = (req, extra = {}) => ({
  companyId: resolveCompanyId(req),
  ...extra,
});

const getRetailerScores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const scores = await SalesmanRetailerScore.find(buildFilter(req))
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('salesmanId')
      .populate('retailerId');

    const total = await SalesmanRetailerScore.countDocuments(buildFilter(req));

    res.json({
      success: true,
      data: scores,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRetailerScore = async (req, res) => {
  try {
    const score = await SalesmanRetailerScore.findOne({
      _id: req.params.id,
      ...buildFilter(req),
    })
      .populate('salesmanId')
      .populate('retailerId');

    if (!score) {
      return res.status(404).json({ success: false, message: 'Retailer score not found' });
    }

    res.json({ success: true, data: score, message: 'Get retailer score' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRetailerScore = async (req, res) => {
  try {
    const { salesmanId, retailerId, score, criteria } = req.body;

    if (!salesmanId || !retailerId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'salesmanId, retailerId, and score are required',
      });
    }

    const record = new SalesmanRetailerScore({
      companyId: resolveCompanyId(req),
      salesmanId,
      retailerId,
      totalScore: score,
      factors: criteria || {},
    });

    await record.save();
    await record.populate('salesmanId');
    await record.populate('retailerId');

    res.status(201).json({
      success: true,
      data: record,
      message: 'Retailer score created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRetailerScores,
  getRetailerScore,
  createRetailerScore,
};
