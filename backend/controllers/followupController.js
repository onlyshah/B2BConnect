const SalesmanFollowup = require('../models/SalesmanFollowup');

const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

const buildFilter = (req, extra = {}) => ({
  companyId: resolveCompanyId(req),
  ...extra,
});

const getFollowups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = buildFilter(req);
    if (req.query.salesmanId) filter.salesmanId = req.query.salesmanId;
    if (req.query.retailerId) filter.retailerId = req.query.retailerId;
    if (req.query.status) filter.status = req.query.status;

    const followups = await SalesmanFollowup.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ followUpDate: 1 })
      .populate('salesmanId')
      .populate('retailerId');

    const total = await SalesmanFollowup.countDocuments(filter);

    res.json({
      success: true,
      data: followups,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      message: 'Get follow-ups list',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFollowupById = async (req, res) => {
  try {
    const followup = await SalesmanFollowup.findOne({
      _id: req.params.id,
      ...buildFilter(req),
    })
      .populate('salesmanId')
      .populate('retailerId');

    if (!followup) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }

    res.json({
      success: true,
      data: followup,
      message: 'Get follow-up',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFollowup = async (req, res) => {
  try {
    const { salesmanId, retailerId, followUpDate, notes, status } = req.body;

    if (!salesmanId || !retailerId || !followUpDate) {
      return res.status(400).json({
        success: false,
        message: 'salesmanId, retailerId, and followUpDate are required',
      });
    }

    const followup = new SalesmanFollowup({
      companyId: resolveCompanyId(req),
      salesmanId,
      retailerId,
      followUpDate,
      notes: notes || '',
      status: status || 'open',
    });

    await followup.save();
    await followup.populate('salesmanId');
    await followup.populate('retailerId');

    res.status(201).json({
      success: true,
      data: followup,
      message: 'Follow-up created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFollowup = async (req, res) => {
  try {
    const followup = await SalesmanFollowup.findOneAndUpdate(
      { _id: req.params.id, ...buildFilter(req) },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('salesmanId').populate('retailerId');

    if (!followup) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }

    res.json({
      success: true,
      data: followup,
      message: 'Follow-up updated',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFollowups,
  getFollowupById,
  createFollowup,
  updateFollowup,
};
