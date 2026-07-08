const InstallmentPlan = require('../models/InstallmentPlan');

const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

const buildFilter = (req, extra = {}) => ({
  companyId: resolveCompanyId(req),
  isDeleted: false,
  ...extra,
});

const getInstallmentPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { invoiceId, retailerId, status } = req.query;

    const filter = buildFilter(req);
    if (invoiceId) filter.invoiceId = invoiceId;
    if (retailerId) filter.retailerId = retailerId;
    if (status) filter.status = status;

    const plans = await InstallmentPlan.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('invoiceId')
      .populate('retailerId');

    const total = await InstallmentPlan.countDocuments(filter);

    res.json({
      success: true,
      data: plans,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createInstallmentPlan = async (req, res) => {
  try {
    const { invoiceId, retailerId, installments, totalAmount } = req.body;

    if (!invoiceId || !retailerId || !installments) {
      return res.status(400).json({
        success: false,
        message: 'invoiceId, retailerId, and installments are required',
      });
    }

    const plan = new InstallmentPlan({
      ...req.body,
      companyId: resolveCompanyId(req),
      totalAmount: totalAmount || req.body.totalAmount || 0,
      status: 'active',
    });

    await plan.save();
    await plan.populate('invoiceId');
    await plan.populate('retailerId');

    res.status(201).json({ success: true, data: plan, message: 'Installment plan created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInstallment = async (req, res) => {
  try {
    const { planId, installmentIndex } = req.params;

    const plan = await InstallmentPlan.findOne({
      _id: planId,
      ...buildFilter(req),
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Installment plan not found' });
    }

    const index = Number(installmentIndex);
    if (!Number.isInteger(index) || !plan.installments[index]) {
      return res.status(404).json({ success: false, message: 'Installment not found' });
    }

    Object.assign(plan.installments[index], req.body);
    plan.status = plan.installments.every((item) => item.status === 'paid')
      ? 'completed'
      : plan.status;
    plan.updatedAt = new Date();
    await plan.save();

    res.json({ success: true, data: plan, message: 'Installment updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInstallmentPlans,
  createInstallmentPlan,
  updateInstallment,
};
