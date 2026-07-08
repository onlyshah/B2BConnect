const Scheme = require('../models/Scheme');
const Company = require('../models/Company');

const seedSchemes = async () => {
  try {
    const existing = await Scheme.countDocuments();
    if (existing > 0) {
      console.log('✓ Schemes already exist');
      return [];
    }

    const company = await Company.findOne({ tenantId: '000000000000000000000001' });
    if (!company) throw new Error('Company not found. Seed companies first.');

    const tenantId = '000000000000000000000001';
    const companyId = company._id.toString();

    const schemes = [
      {
        tenantId,
        companyId,
        name: 'Buy 2 Get 1',
        type: 'buy-and-get',
        description: 'Buy 2 items and get 1 free on selected SKUs',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        status: 'active'
      },
      {
        tenantId,
        companyId,
        name: 'Festive Discount',
        type: 'discount',
        description: 'Flat 15% off on orders above ₹500',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
        status: 'active'
      }
    ];

    const created = await Scheme.insertMany(schemes);
    console.log(`✓ Created ${created.length} schemes`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding schemes:', error.message);
    throw error;
  }
};

module.exports = seedSchemes;
