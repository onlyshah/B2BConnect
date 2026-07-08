const SalesmanCompetitorReport = require('../models/SalesmanCompetitorReport');

const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

const buildFilter = (req, extra = {}) => ({
  companyId: resolveCompanyId(req),
  ...extra,
});

const getCompetitorReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await SalesmanCompetitorReport.find(buildFilter(req))
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('salesmanId')
      .populate('retailerId');

    const total = await SalesmanCompetitorReport.countDocuments(buildFilter(req));

    res.json({
      success: true,
      data: reports,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCompetitorReport = async (req, res) => {
  try {
    const report = await SalesmanCompetitorReport.findOne({
      _id: req.params.id,
      ...buildFilter(req),
    })
      .populate('salesmanId')
      .populate('retailerId');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Competitor report not found' });
    }

    res.json({ success: true, data: report, message: 'Get competitor report' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCompetitorReport = async (req, res) => {
  try {
    const { salesmanId, retailerId, competitorBrand, competitorPrice, notes } = req.body;

    if (!salesmanId || !retailerId || !competitorBrand) {
      return res.status(400).json({
        success: false,
        message: 'salesmanId, retailerId, and competitorBrand are required',
      });
    }

    const report = new SalesmanCompetitorReport({
      companyId: resolveCompanyId(req),
      salesmanId,
      retailerId,
      competitorBrand,
      competitorPrice,
      notes,
    });

    await report.save();
    await report.populate('salesmanId');
    await report.populate('retailerId');

    res.status(201).json({
      success: true,
      data: report,
      message: 'Competitor report created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCompetitorReports,
  getCompetitorReport,
  createCompetitorReport,
};
