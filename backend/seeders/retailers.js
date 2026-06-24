const Retailer = require('../models/Retailer');
const Distributor = require('../models/Distributor');
const Company = require('../models/Company');

const seedRetailers = async () => {
  try {
    const existingCount = await Retailer.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Retailers already exist');
      return [];
    }

    const distributors = await Distributor.find({
      tenantId: '000000000000000000000001',
    });
    if (distributors.length === 0) {
      throw new Error('Distributors not found. Seed distributors first.');
    }

    const company = await Company.findOne({
      tenantId: '000000000000000000000001',
    });
    if (!company) {
      throw new Error('Company not found. Seed companies first.');
    }

    const retailers = [
      // Mumbai retailers
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        distributorId: distributors[0]._id,
        name: 'Krishna Provision Store',
        storeName: 'Krishna Provision Store',
        gstin: '27AABCT1234G1Z0',
        location: {
          address: '101 Market Lane, Mumbai, MH 400003',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400003'
        },
        category: 'gold',
        status: 'active',
        loyaltyPoints: 1500,
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        distributorId: distributors[0]._id,
        name: 'Jay Ambe Super Market',
        storeName: 'Jay Ambe Super Market',
        gstin: '27AABCT1234G2Z0',
        location: {
          address: '202 Retail Plaza, Mumbai, MH 400004',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400004'
        },
        category: 'silver',
        status: 'active',
        loyaltyPoints: 1200,
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        distributorId: distributors[0]._id,
        name: 'Metro Convenience Store',
        storeName: 'Metro Convenience Store',
        gstin: '27AABCT1234G3Z0',
        location: {
          address: '303 Shopping District, Mumbai, MH 400005',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400005'
        },
        category: 'silver',
        status: 'active',
        loyaltyPoints: 800,
      },
      // Bangalore retailers
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        distributorId: distributors[1]._id,
        name: 'Coastal Traders',
        storeName: 'Coastal Traders',
        gstin: '29AABCU5678G1Z0',
        location: {
          address: '404 Tech Park Lane, Bangalore, KA 560003',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560003'
        },
        category: 'gold',
        status: 'active',
        loyaltyPoints: 1600,
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        distributorId: distributors[1]._id,
        name: 'South Indian Stores',
        storeName: 'South Indian Stores',
        gstin: '29AABCU5678G2Z0',
        location: {
          address: '505 Garden Square, Bangalore, KA 560004',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560004'
        },
        category: 'silver',
        status: 'active',
        loyaltyPoints: 1100,
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        distributorId: distributors[1]._id,
        name: 'Bangalore Retail Hub',
        storeName: 'Bangalore Retail Hub',
        gstin: '29AABCU5678G3Z0',
        location: {
          address: '606 Business Center, Bangalore, KA 560005',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560005'
        },
        category: 'silver',
        status: 'active',
        loyaltyPoints: 700,
      },
      // Delhi retailers
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        distributorId: distributors[2]._id,
        name: 'North Delhi Mart',
        storeName: 'North Delhi Mart',
        gstin: '07AABCT1234G1Z0',
        location: {
          address: '707 Commercial Street, Delhi, DL 110002',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110002'
        },
        category: 'platinum',
        status: 'active',
        loyaltyPoints: 2000,
      },
      {
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        distributorId: distributors[2]._id,
        name: 'Delhi Central Store',
        storeName: 'Delhi Central Store',
        gstin: '07AABCT1234G2Z0',
        location: {
          address: '808 Trade Center, Delhi, DL 110003',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110003'
        },
        category: 'silver',
        status: 'active',
        loyaltyPoints: 950,
      },
    ];

    const created = await Retailer.insertMany(retailers);
    console.log(`✓ Created ${created.length} retailers`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding retailers:', error.message);
    throw error;
  }
};

module.exports = seedRetailers;
