const DistributorProductPrice = require('../models/DistributorProductPrice');
const Distributor = require('../models/Distributor');
const Product = require('../models/Product');
const Company = require('../models/Company');

const seedPricing = async () => {
  try {
    const existingCount = await DistributorProductPrice.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Pricing rules already exist');
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
      throw new Error(
        'Distributors or products not found. Seed those first.'
      );
    }

    const pricingRules = [];

    // Create pricing for each distributor-product combination
    for (const distributor of distributors) {
      for (const product of products) {
        // Silver category pricing
        pricingRules.push({
          tenantId: '000000000000000000000001',
          companyId: company._id.toString(),
          distributorId: distributor._id.toString(),
          productId: product._id.toString(),
          basePrice: product.mrp * 0.7,
          retailerCategory: 'silver',
          minQuantity: 1,
          discountType: 'percent',
          discountValue: 5,
          status: 'active',
        });

        // Gold category pricing
        pricingRules.push({
          tenantId: '000000000000000000000001',
          companyId: company._id.toString(),
          distributorId: distributor._id.toString(),
          productId: product._id.toString(),
          basePrice: product.mrp * 0.7,
          retailerCategory: 'gold',
          minQuantity: 1,
          discountType: 'percent',
          discountValue: 8,
          status: 'active',
        });

        // Platinum category pricing
        pricingRules.push({
          tenantId: '000000000000000000000001',
          companyId: company._id.toString(),
          distributorId: distributor._id.toString(),
          productId: product._id.toString(),
          basePrice: product.mrp * 0.7,
          retailerCategory: 'platinum',
          minQuantity: 1,
          discountType: 'percent',
          discountValue: 12,
          status: 'active',
        });

        // Bulk order discount (100+ units)
        pricingRules.push({
          tenantId: '000000000000000000000001',
          companyId: company._id.toString(),
          distributorId: distributor._id.toString(),
          productId: product._id.toString(),
          basePrice: product.mrp * 0.7,
          retailerCategory: 'all',
          minQuantity: 100,
          discountType: 'percent',
          discountValue: 15,
          status: 'active',
        });
      }
    }

    const created = await DistributorProductPrice.insertMany(pricingRules);
    console.log(`✓ Created ${created.length} pricing rules`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding pricing:', error.message);
    throw error;
  }
};

module.exports = seedPricing;
