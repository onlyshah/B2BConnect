const Salesman = require('../models/Salesman');
const Distributor = require('../models/Distributor');
const Company = require('../models/Company');

const seedSalesmen = async () => {
  try {
    const existingCount = await Salesman.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Salesmen already exist');
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
    if (distributors.length === 0) {
      throw new Error('Distributors not found. Seed distributors first.');
    }

    const salesmen = [
      // Patel Distributors salesmen
      {
        tenantId: company._id,
        firstName: 'Ravi',
        lastName: 'Sharma',
        email: 'ravi.sharma@b2bconnect.in',
        phone: '+91-9876543240',
        employeeId: 'SAL-001',
        company: company._id,
        distributors: [distributors[0]._id],
        dailyVisitTarget: 20,
        monthlyOrderTarget: 40,
        status: 'active',
        verificationStatus: 'verified',
        baseSalary: 25000,
      },
      {
        tenantId: company._id,
        firstName: 'Arun',
        lastName: 'Patel',
        email: 'arun.patel@b2bconnect.in',
        phone: '+91-9876543241',
        employeeId: 'SAL-002',
        company: company._id,
        distributors: [distributors[0]._id],
        dailyVisitTarget: 20,
        monthlyOrderTarget: 40,
        status: 'active',
        verificationStatus: 'verified',
        baseSalary: 25000,
      },
      // Arihant Agencies salesmen
      {
        tenantId: company._id,
        firstName: 'Suresh',
        lastName: 'Kumar',
        email: 'suresh.kumar@b2bconnect.in',
        phone: '+91-9876543242',
        employeeId: 'SAL-003',
        company: company._id,
        distributors: [distributors[1]._id],
        dailyVisitTarget: 20,
        monthlyOrderTarget: 40,
        status: 'active',
        verificationStatus: 'verified',
        baseSalary: 25000,
      },
      {
        tenantId: company._id,
        firstName: 'Priya',
        lastName: 'Singh',
        email: 'priya.singh@b2bconnect.in',
        phone: '+91-9876543243',
        employeeId: 'SAL-004',
        company: company._id,
        distributors: [distributors[1]._id],
        dailyVisitTarget: 20,
        monthlyOrderTarget: 40,
        status: 'active',
        verificationStatus: 'verified',
        baseSalary: 25000,
      },
      // Delhi Trade House salesmen
      {
        tenantId: company._id,
        firstName: 'Vikram',
        lastName: 'Verma',
        email: 'vikram.verma@b2bconnect.in',
        phone: '+91-9876543244',
        employeeId: 'SAL-005',
        company: company._id,
        distributors: [distributors[2]._id],
        dailyVisitTarget: 20,
        monthlyOrderTarget: 40,
        status: 'active',
        verificationStatus: 'verified',
        baseSalary: 25000,
      },
      {
        tenantId: company._id,
        firstName: 'Neha',
        lastName: 'Gupta',
        email: 'neha.gupta@b2bconnect.in',
        phone: '+91-9876543245',
        employeeId: 'SAL-006',
        company: company._id,
        distributors: [distributors[2]._id],
        dailyVisitTarget: 20,
        monthlyOrderTarget: 40,
        status: 'active',
        verificationStatus: 'verified',
        baseSalary: 25000,
      },
    ];

    const created = await Salesman.insertMany(salesmen);
    console.log(`✓ Created ${created.length} salesmen`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding salesmen:', error.message);
    throw error;
  }
};

module.exports = seedSalesmen;
