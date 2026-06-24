const Distributor = require('../models/Distributor');
const Company = require('../models/Company');

const seedDistributors = async () => {
  try {
    const existingCount = await Distributor.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Distributors already exist');
      return [];
    }

    const company = await Company.findOne({ tenantId: '000000000000000000000001' });
    if (!company) {
      throw new Error('Company not found. Seed companies first.');
    }

    const distributors = [
      {
        tenantId: '000000000000000000000001',
        companyId: company._id,
        name: 'Patel Distributors',
        email: 'patel@distributors.com',
        phone: '+91-9876543220',
        address: '789 Market Street, Mumbai, MH 400002',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        gstNumber: '27AABCD9876M1Z0',
        contactPerson: 'Rajesh Patel',
        contactPhone: '+91-9876543221',
        status: 'approved',
        registrationType: 'distributor',
        territory: 'Western Region',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id,
        name: 'Arihant Agencies',
        email: 'info@arihant.com',
        phone: '+91-9876543222',
        address: '321 Commercial Hub, Bangalore, KA 560002',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560002',
        gstNumber: '29AABCE2468K2Z1',
        contactPerson: 'Arjun Sharma',
        contactPhone: '+91-9876543223',
        status: 'approved',
        registrationType: 'distributor',
        territory: 'Southern Region',
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id,
        name: 'Delhi Trade House',
        email: 'trade@delhihouse.com',
        phone: '+91-9876543224',
        address: '654 Enterprise Zone, Delhi, DL 110001',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        gstNumber: '07AABCF5678P1Z0',
        contactPerson: 'Vikram Singh',
        contactPhone: '+91-9876543225',
        status: 'approved',
        registrationType: 'distributor',
        territory: 'Northern Region',
      },
    ];

    const created = await Distributor.insertMany(distributors);
    console.log(`✓ Created ${created.length} distributors`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding distributors:', error.message);
    throw error;
  }
};

module.exports = seedDistributors;
