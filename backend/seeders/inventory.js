const Inventory = require('../models/Inventory');
const Distributor = require('../models/Distributor');
const Product = require('../models/Product');
const Company = require('../models/Company');

const seedInventory = async () => {
  try {
    const existingCount = await Inventory.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Inventory already exists');
      return [];
    }

    const company = await Company.findOne({
      tenantId: '000000000000000000000001',
    });
    if (!company) {
      throw new Error('Company not found. Seed companies first.');
    }

    const distributors = await Distributor.find({
      tenantId: '000000000000000000000001',
    });
    const products = await Product.find({
      tenantId: '000000000000000000000001',
    });

    if (distributors.length === 0 || products.length === 0) {
      throw new Error('Distributors or products not found. Seed those first.');
    }

    const inventory = [];

    // Create inventory for each distributor-product combination
    for (const distributor of distributors) {
      for (const product of products) {
        const stockOnHand = Math.floor(Math.random() * 500) + 100;
        const reorderLevel = 50;
        const reorderQuantity = 200;

        inventory.push({
          tenantId: '000000000000000000000001',
          companyId: company._id.toString(),
          distributorId: distributor._id.toString(),
          productId: product._id.toString(),
          stockOnHand,
          reorderLevel,
          reorderQuantity,
          lastUpdated: new Date(),
          alerts: stockOnHand <= reorderLevel
            ? [{ type: 'low-stock', severity: 'warning', date: new Date() }]
            : [],
        });
      }
    }

    const created = await Inventory.insertMany(inventory);
    console.log(`✓ Created ${created.length} inventory records`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding inventory:', error.message);
    throw error;
  }
};

module.exports = seedInventory;
