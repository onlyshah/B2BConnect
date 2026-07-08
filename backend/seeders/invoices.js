const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const Company = require('../models/Company');

const seedInvoices = async () => {
  try {
    const existingCount = await Invoice.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Invoices already exist');
      return [];
    }

    const company = await Company.findOne({
      tenantId: '000000000000000000000001',
    });
    if (!company) {
      throw new Error('Company not found. Seed companies first.');
    }

    const orders = await Order.find({
      tenantId: '000000000000000000000001',
      status: { $in: ['approved', 'dispatched', 'delivered'] },
    });

    if (orders.length === 0) {
      console.log('✓ No approved orders to create invoices');
      return [];
    }

    const invoices = [];

    // Create invoice for each approved/dispatched/delivered order
    for (const order of orders) {
      const invoiceDate = new Date();
      const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Determine invoice status based on order status
      let invoiceStatus = 'issued';
      let amountPaid = 0;

      if (order.status === 'delivered') {
        // 70% chance of paid if delivered
        if (Math.random() > 0.3) {
          invoiceStatus = 'paid';
          amountPaid = order.total;
        } else if (Math.random() > 0.5) {
          invoiceStatus = 'overdue';
        }
      }

      invoices.push({
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        invoiceNumber: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        orderId: order._id,
        retailerId: order.retailerId,
        distributorId: order.distributorId,
        amountDue: order.total,
        amountPaid,
        status: invoiceStatus,
        invoiceDate,
        dueDate,
        paidAt: invoiceStatus === 'paid' ? new Date() : null,
        lineItems: order.items,
      });
    }

    const created = await Invoice.insertMany(invoices);
    console.log(`✓ Created ${created.length} invoices`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding invoices:', error.message);
    throw error;
  }
};

module.exports = seedInvoices;
