const Invoice = require('../models/Invoice');

// Get all invoices
const getInvoices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { retailerId, distributorId, status } = req.query;

    const filter = { tenantId: req.tenantId };
    if (retailerId) filter.retailerId = retailerId;
    if (distributorId) filter.distributorId = distributorId;
    if (status) filter.status = status;

    const invoices = await Invoice.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ dueDate: 1, createdAt: -1 })
      .populate('retailerId')
      .populate('distributorId');

    const total = await Invoice.countDocuments(filter);

    res.json({
      success: true,
      data: invoices,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single invoice
const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.invoiceId,
      tenantId: req.tenantId,
    })
      .populate('retailerId')
      .populate('distributorId');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create invoice
const createInvoice = async (req, res) => {
  try {
    const { retailerId, distributorId, invoiceNumber, amountDue, dueDate, lineItems } = req.body;

    if (!retailerId || !distributorId || !invoiceNumber || !amountDue) {
      return res.status(400).json({
        success: false,
        message: 'retailerId, distributorId, invoiceNumber, and amountDue are required',
      });
    }

    const invoice = new Invoice({
      ...req.body,
      tenantId: req.tenantId,
      status: 'issued',
      amountPaid: 0,
    });

    await invoice.save();
    await invoice.populate('retailerId');
    await invoice.populate('distributorId');

    res.status(201).json({ success: true, data: invoice, message: 'Invoice created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.invoiceId, tenantId: req.tenantId },
      req.body,
      { new: true }
    )
      .populate('retailerId')
      .populate('distributorId');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice, message: 'Invoice updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get outstanding invoices summary
const getOutstandingSummary = async (req, res) => {
  try {
    const { retailerId, distributorId } = req.query;
    const filter = { tenantId: req.tenantId, status: { $in: ['issued', 'overdue'] } };
    if (retailerId) filter.retailerId = retailerId;
    if (distributorId) filter.distributorId = distributorId;

    const invoices = await Invoice.find(filter);
    const totalOutstanding = invoices.reduce((sum, invoice) => {
      return sum + Math.max((invoice.amountDue || 0) - (invoice.amountPaid || 0), 0);
    }, 0);

    const overdueCount = invoices.filter(
      (invoice) =>
        invoice.status === 'overdue' ||
        (invoice.dueDate && invoice.dueDate < new Date())
    ).length;

    res.json({
      success: true,
      data: {
        invoiceCount: invoices.length,
        totalOutstanding,
        overdueCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark invoice as paid
const markInvoiceAsPaid = async (req, res) => {
  try {
    const { amountPaid } = req.body;

    if (!amountPaid) {
      return res.status(400).json({ success: false, message: 'Amount paid is required' });
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.invoiceId, tenantId: req.tenantId },
      {
        amountPaid,
        status: 'paid',
        paidAt: new Date(),
      },
      { new: true }
    )
      .populate('retailerId')
      .populate('distributorId');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice, message: 'Invoice marked as paid' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.invoiceId,
      tenantId: req.tenantId,
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  getOutstandingSummary,
  markInvoiceAsPaid,
  deleteInvoice,
};
