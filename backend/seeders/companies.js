const Company = require('../models/Company');

const seedCompanies = async () => {
  try {
    const existingCount = await Company.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Companies already exist');
      return [];
    }

    const companies = [
      {
        tenantId: '000000000000000000000001',
        name: 'ARRVI Personal Care',
        industry: 'Personal Care & Cosmetics',
        email: 'contact@arrvi.com',
        phone: '+91-9876543210',
        address: '123 Business Avenue, Mumbai, MH 400001',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pincode: '400001',
        gstNumber: '27AABCT1234H1Z0',
        status: 'active',
        registrationType: 'manufacturer',
        companyType: 'B2B',
      },
      {
        tenantId: '000000000000000000000001',
        name: 'FreshSip Beverages',
        industry: 'Food & Beverages',
        email: 'info@freshsip.com',
        phone: '+91-9876543211',
        address: '456 Trade Plaza, Bangalore, KA 560001',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        pincode: '560001',
        gstNumber: '29AABCU5678K2Z1',
        status: 'active',
        registrationType: 'manufacturer',
        companyType: 'B2B',
      },
    ];

    const created = await Company.insertMany(companies);
    console.log(`✓ Created ${created.length} companies`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding companies:', error.message);
    throw error;
  }
};

module.exports = seedCompanies;
