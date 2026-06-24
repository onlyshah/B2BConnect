const Order = require('../models/Order');
const Retailer = require('../models/Retailer');
const Product = require('../models/Product');
const Distributor = require('../models/Distributor');
const Company = require('../models/Company');

const seedOrders = async () => {
  try {
    const existingCount = await Order.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Orders already exist');
      return [];
    }

    const company = await Company.findOne({
      tenantId: '000000000000000000000001',
    });
    if (!company) {
      throw new Error('Company not found. Seed companies first.');
    }

    const retailers = await Retailer.find({
      tenantId: '000000000000000000000001',
    });
    const products = await Product.find({
      tenantId: '000000000000000000000001',
    });
    const distributors = await Distributor.find({
      tenantId: '000000000000000000000001',
    });

    if (retailers.length === 0 || products.length === 0 || distributors.length === 0) {
      throw new Error('Retailers, products, or distributors not found. Seed those first.');
    }

    const orders = [];

    // Create 30 sample orders
    for (let i = 0; i < 30; i++) {
      const retailer = retailers[Math.floor(Math.random() * retailers.length)];
      const distributor = distributors.find((d) => d._id.toString() === retailer.distributorId.toString());
      const numItems = Math.floor(Math.random() * 3) + 1;
      const items = [];
      let subtotal = 0;

      // Add random products to order
      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 50) + 10;
        const unitPrice = product.mrp * 0.7; // Distributor price
        const itemTotal = unitPrice * quantity;
        items.push({
          productId: product._id.toString(),
          quantity,
          unitPrice,
          discount: 0,
        });
        subtotal += itemTotal;
      }

      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + tax;

      // Random statuses
      const statuses = ['pending', 'confirmed', 'approved', 'packed', 'shipped', 'delivered', 'cancelled'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      orders.push({
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        distributorId: distributor._id.toString(),
        retailerId: retailer._id.toString(),
        items,
        subtotal,
        tax,
        total,
        status,
        orderType: 'retailer-order',
        paymentTerms: 'Net 30',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    const created = await Order.insertMany(orders);
    console.log(`✓ Created ${created.length} orders`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding orders:', error.message);
    throw error;
  }
};

module.exports = seedOrders;
