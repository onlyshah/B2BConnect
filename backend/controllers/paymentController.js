const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

// Get all payments
const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { invoiceId, retailerId, distributorId } = req.query;

    const filter = { tenantId: req.tenantId };
    if (invoiceId) filter.invoiceId = invoiceId;
    if (retailerId) filter.retailerId = retailerId;
    if (distributorId) filter.distributorId = distributorId;

    const payments = await Payment.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ paidAt: -1 })
      .populate('invoiceId')
      .populate('retailerId')
      .populate('distributorId');

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      data: payments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single payment
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.paymentId,
      tenantId: req.tenantId,
    })
      .populate('invoiceId')
      .populate('retailerId')
      .populate('distributorId');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create payment
const createPayment = async (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod, transactionId } = req.body;

    if (!invoiceId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'invoiceId and amount are required',
      });
    }

    const payment = new Payment({
      ...req.body,
      tenantId: req.tenantId,
      paidAt: new Date(),
      status: 'completed',
    });

    await payment.save();

    // Update invoice
    const invoice = await Invoice.findOne({
      _id: payment.invoiceId,
      tenantId: req.tenantId,
    });

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

module.exports = {
  getPayments,
  getPayment,
  createPayment,
};
