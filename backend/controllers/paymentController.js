const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

function buildPaymentFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { invoiceId, retailerId, distributorId } = req.query;
    const filter = buildPaymentFilter(req);
    if (invoiceId) filter.invoiceId = invoiceId;
    if (retailerId) filter.retailerId = retailerId;
    if (distributorId) filter.distributorId = distributorId;
    const payments = await Payment.find(filter).skip(skip).limit(limit).sort({ paidAt: -1 }).populate('invoiceId').populate('retailerId').populate('distributorId');
    const total = await Payment.countDocuments(filter);
    res.json({ success: true, data: payments, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.paymentId, ...buildPaymentFilter(req) }).populate('invoiceId').populate('retailerId').populate('distributorId');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { invoiceId, amount } = req.body;
    if (!invoiceId || !amount) return res.status(400).json({ success: false, message: 'invoiceId and amount are required' });
    const payment = new Payment({ ...req.body, tenantId: req.tenantId, companyId: resolveCompanyId(req), paidAt: new Date(), status: 'recorded' });
    await payment.save();

    const invoice = await Invoice.findOne({ _id: payment.invoiceId, ...buildPaymentFilter(req) });
    if (invoice) {
      invoice.amountPaid = (invoice.amountPaid || 0) + payment.amount;
      invoice.status = invoice.amountPaid >= invoice.amountDue ? 'paid' : 'issued';
      invoice.updatedAt = new Date();
      await invoice.save();
    }

    await payment.populate('invoiceId');
    await payment.populate('retailerId');
    await payment.populate('distributorId');
    res.status(201).json({ success: true, data: payment, message: 'Payment created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPayments, getPayment, createPayment };
