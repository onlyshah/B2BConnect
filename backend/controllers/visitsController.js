const Visit = require('../models/Visit');
const Salesman = require('../models/Salesman');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

function buildVisitFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

const getVisits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { salesman, retailer, status, startDate, endDate } = req.query;

    const filter = buildVisitFilter(req);
    if (salesman) filter.salesman = salesman;
    if (retailer) filter.retailer = retailer;
    if (status) filter.visitOutcome = status;
    if (startDate || endDate) {
      filter.visitDate = {};
      if (startDate) filter.visitDate.$gte = new Date(startDate);
      if (endDate) filter.visitDate.$lte = new Date(endDate);
    }

    const visits = await Visit.find(filter).skip(skip).limit(limit).sort({ visitDate: -1 }).populate('salesman').populate('retailer').populate('productsShown');
    const total = await Visit.countDocuments(filter);
    res.json({ success: true, data: visits, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVisit = async (req, res) => {
  try {
    const visit = await Visit.findOne({ _id: req.params.id, ...buildVisitFilter(req) }).populate('salesman').populate('retailer').populate('productsShown');
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.json({ success: true, data: visit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVisit = async (req, res) => {
  try {
    const { salesman, retailer } = req.body;
    if (!salesman || !retailer) return res.status(400).json({ success: false, message: 'salesman and retailer are required' });
    const visit = new Visit({ ...req.body, tenantId: req.tenantId, companyId: resolveCompanyId(req) });
    await visit.save();
    await visit.populate('salesman');
    await visit.populate('retailer');
    await visit.populate('productsShown');
    res.status(201).json({ success: true, data: visit, message: 'Visit recorded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVisits, getVisit, createVisit };
