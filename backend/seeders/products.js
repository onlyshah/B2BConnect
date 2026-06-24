const Product = require('../models/Product');
const Company = require('../models/Company');

const seedProducts = async () => {
  try {
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Products already exist');
      return [];
    }

    const company = await Company.findOne({ tenantId: '000000000000000000000001' });
    if (!company) {
      throw new Error('Company not found. Seed companies first.');
    }

    const products = [
      // ARRVI Personal Care Products
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'ARRVI-001',
        name: 'ARRVI Moisturizing Body Lotion',
        mrp: 299,
        gst: 18,
        packSize: '200ml',
        benefits: ['Moisturizing', 'Non-greasy'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'ARRVI-002',
        name: 'ARRVI Face Wash Gentle Formula',
        mrp: 149,
        gst: 18,
        packSize: '150ml',
        benefits: ['Gentle', 'Sensitive skin friendly'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'ARRVI-003',
        name: 'ARRVI Shampoo with Keratin',
        mrp: 179,
        gst: 18,
        packSize: '200ml',
        benefits: ['Keratin enriched', 'Strong hair'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'ARRVI-004',
        name: 'ARRVI Conditioner Repair Therapy',
        mrp: 169,
        gst: 18,
        packSize: '200ml',
        benefits: ['Hair repair', 'Deep conditioning'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'ARRVI-005',
        name: 'ARRVI Toothpaste Fresh Mint',
        mrp: 99,
        gst: 18,
        packSize: '100g',
        benefits: ['Fresh breath', 'Cavity protection'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'ARRVI-006',
        name: 'ARRVI Perfume Signature Collection',
        mrp: 399,
        gst: 28,
        packSize: '50ml',
        benefits: ['Long lasting', 'Premium fragrance'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'ARRVI-007',
        name: 'ARRVI Hand Soap Moisturizing',
        mrp: 119,
        gst: 18,
        packSize: '200ml',
        benefits: ['Antimicrobial', 'Moisturizing'],
        launchStatus: 'live',
      },
      // FreshSip Beverages Products
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'FRESHS-001',
        name: 'FreshSip Orange Juice 1L',
        mrp: 149,
        gst: 5,
        packSize: '1L',
        benefits: ['100% Natural', 'Rich in Vitamin C'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'FRESHS-002',
        name: 'FreshSip Mango Smoothie Mix',
        mrp: 129,
        gst: 5,
        packSize: '500g',
        benefits: ['No added sugar', 'Ready to blend'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'FRESHS-003',
        name: 'FreshSip Coconut Water Natural',
        mrp: 79,
        gst: 5,
        packSize: '500ml',
        benefits: ['Electrolytes', 'Pure coconut'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'FRESHS-004',
        name: 'FreshSip Iced Tea Lemon Flavor',
        mrp: 99,
        gst: 5,
        packSize: '600ml',
        benefits: ['Refreshing', 'No preservatives'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'FRESHS-005',
        name: 'FreshSip Energy Drink Power Boost',
        mrp: 89,
        gst: 18,
        packSize: '250ml',
        benefits: ['Energy boost', 'Electrolytes'],
        launchStatus: 'live',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        sku: 'FRESHS-006',
        name: 'FreshSip Aloe Vera Juice Wellness',
        mrp: 159,
        gst: 12,
        packSize: '1L',
        benefits: ['Health benefits', 'Organic'],
        launchStatus: 'live',
      },
    ];

    const created = await Product.insertMany(products);
    console.log(`✓ Created ${created.length} products`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding products:', error.message);
    throw error;
  }
};

module.exports = seedProducts;
