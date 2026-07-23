const User = require('../models/User');
const Company = require('../models/Company');
const Distributor = require('../models/Distributor');
const Retailer = require('../models/Retailer');
const Salesman = require('../models/Salesman');
const bcryptjs = require('bcryptjs');

const seedUsers = async () => {
  try {
    const company = await Company.findOne({
      tenantId: '000000000000000000000001',
    });
    const distributors = await Distributor.find({
      tenantId: '000000000000000000000001',
    });
    const salesmenList = await Salesman.find({
      $or: [
        { tenantId: company?._id },
        { tenantId: company?._id?.toString() },
        { tenantId: '000000000000000000000001' },
      ],
    });
    const retailer = await Retailer.findOne({
      tenantId: '000000000000000000000001',
    });

    if (!company || distributors.length === 0) {
      throw new Error(
        'Company or distributors not found. Seed those first.'
      );
    }

    const passwordHash = await bcryptjs.hash('User@2026', 10);
    const baseUsers = [
      // Company Admin
      {
        tenantId: '000000000000000000000001',
        companyId: company._id,
        name: `${company.name} Operations Head`,
        email: 'admin@aarvi.com',
        phone: '+91-9876543250',
        passwordHash: passwordHash,
        role: 'company-admin',
        status: 'active',
      },
      // Distributor Admins
      ...distributors.map((distributor, index) => ({
        tenantId: '000000000000000000000001',
        distributorId: distributor._id,
        name: `${distributor.name} Operations Admin`,
        email: `admin${index + 1}@distributors.com`,
        phone: `+91-9876543${260 + index}`,
        passwordHash: passwordHash,
        role: 'distributor-admin',
        status: 'active',
      })),
      // Salesman Users
      ...salesmenList.map((salesman) => ({
        tenantId: '000000000000000000000001',
        distributorId: salesman.distributorId,
        salesmanId: salesman._id,
        name: `${salesman.firstName} ${salesman.lastName}`,
        email: salesman.email,
        phone: salesman.phone,
        passwordHash: passwordHash,
        role: 'salesman',
        status: 'active',
      })),
      // Retailer Seed User
      ...(retailer ? [{
        tenantId: '000000000000000000000001',
        companyId: company._id,
        distributorId: retailer.distributorId,
        retailerId: retailer._id,
        name: `${retailer.name} Store Owner`,
        email: 'retailer@aarvi.com',
        phone: '+91-9876543299',
        passwordHash: passwordHash,
        role: 'retailer',
        status: 'active',
      }] : []),
    ];

    const existingUsers = await User.find({
      email: { $in: baseUsers.map((user) => user.email) },
    }).lean();

    const existingEmails = new Set(existingUsers.map((user) => user.email));
    const usersToCreate = baseUsers.filter((user) => !existingEmails.has(user.email));

    if (usersToCreate.length === 0) {
      console.log('✓ Users already exist');
      return [];
    }

    const created = await User.insertMany(usersToCreate);
    console.log(`✓ Created ${created.length} users`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding users:', error.message);
    throw error;
  }
};

module.exports = seedUsers;
