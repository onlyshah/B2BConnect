const User = require('../models/User');
const bcryptjs = require('bcryptjs');

const seedSuperAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@b2bconnect.in' });
    if (existingAdmin) {
      console.log('✓ Super Admin already exists');
      return existingAdmin;
    }

    const passwordHash = await bcryptjs.hash('B2BConnect@2026', 10);
    const superAdmin = new User({
      tenantId: '000000000000000000000001',
      name: 'System Administrator',
      email: 'admin@b2bconnect.in',
      phone: '+91-9876543210',
      passwordHash,
      role: 'super-admin',
      status: 'active',
    });

    await superAdmin.save();
    console.log('✓ Super Admin created successfully');
    return superAdmin;
  } catch (error) {
    console.error('✗ Error seeding super admin:', error.message);
    throw error;
  }
};

module.exports = seedSuperAdmin;
