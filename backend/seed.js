#!/usr/bin/env node

/**
 * B2BConnect Database Seeder Runner (JavaScript)
 * Production-grade seeder with realistic business data
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import all models to register schemas
require('./models/User');
require('./models/Company');
require('./models/Distributor');
require('./models/Product');
require('./models/Retailer');
require('./models/Salesman');
require('./models/Territory');
require('./models/Order');
require('./models/Visit');
require('./models/CollectionRecord');
require('./models/Inventory');
require('./models/Notification');
require('./models/Story');
require('./models/Review');
require('./models/Sample');
require('./models/Scheme');
require('./models/Invoice');
require('./models/Payment');
require('./models/Analytics');
require('./models/DistributorProductPrice');
require('./models/rbac/Permission');
require('./models/rbac/Role');
require('./models/registration/RegistrationRequest');
require('./models/registration/CompanyApplication');
require('./models/registration/DistributorApplication');
require('./models/registration/RetailerApplication');
require('./models/registration/SalesmanApplication');

// Import seeders
const { seedPermissions } = require('./seeders/permissions');
const { seedDefaultRoles } = require('./seeders/roles');
const seedSuperAdmin = require('./seeders/super-admin');
const seedCompanies = require('./seeders/companies');
const seedDistributors = require('./seeders/distributors');
const seedRetailers = require('./seeders/retailers');
const seedProducts = require('./seeders/products');
const seedSalesmen = require('./seeders/salesmen');
const seedPricing = require('./seeders/pricing');
const seedUsers = require('./seeders/users');
const seedOrders = require('./seeders/orders');
const seedInventory = require('./seeders/inventory');
const seedInvoices = require('./seeders/invoices');
const seedRegistrations = require('./seeders/registrations');
const seedVisits = require('./seeders/visits');
const seedActivity = require('./seeders/activity');
const seedAttendance = require('./seeders/attendance');

async function runSeeder() {
  const startTime = Date.now();

  try {
    const shouldRebuild = process.argv.includes('--rebuild') || process.argv.includes('rebuild');

    if (shouldRebuild) {
      await mongoose.connection.db.dropDatabase();
      console.log('🗑️  Dropped existing database before reseeding');
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log(`🌱 B2BConnect Database Seeder - PRODUCTION SETUP`);
    console.log(`${'='.repeat(70)}\n`);

    // Step 1: RBAC Permissions
    console.log('📝 Step 1: Creating RBAC Permissions...');
    const permissions = await seedPermissions();
    console.log('✓ Permissions created\n');

    // Step 2: RBAC Roles
    console.log('📝 Step 2: Creating RBAC Roles...');
    const roles = await seedDefaultRoles();
    console.log('✓ Roles created\n');

    // Step 3: Super Admin
    console.log('📝 Step 3: Creating Super Admin...');
    const superAdmin = await seedSuperAdmin();
    console.log('✓ Super Admin created\n');

    // Step 4: Companies
    console.log('📝 Step 4: Creating Companies (ARRVI, FreshSip)...');
    const companies = await seedCompanies();
    console.log('✓ Companies created\n');

    // Step 5: Distributors
    console.log('📝 Step 5: Creating Distributors...');
    const distributors = await seedDistributors();
    console.log('✓ Distributors created\n');

    // Step 6: Retailers
    console.log('📝 Step 6: Creating Retailers...');
    const retailers = await seedRetailers();
    console.log('✓ Retailers created\n');

    // Step 7: Products
    console.log('📝 Step 7: Creating Products (Personal Care & Beverages)...');
    const products = await seedProducts();
    console.log('✓ Products created\n');

    // Step 8: Salesmen
    console.log('📝 Step 8: Creating Salesmen...');
    const salesmen = await seedSalesmen();
    console.log('✓ Salesmen created\n');

    // Step 9: Pricing Rules
    console.log('📝 Step 9: Creating Pricing Rules...');
    const pricing = await seedPricing();
    console.log('✓ Pricing rules created\n');

    // Step 10: Users (with different roles)
    console.log('📝 Step 10: Creating Users (Company Admin, Distributor Admin, Salesmen)...');
    const users = await seedUsers();
    console.log('✓ Users created\n');

    // Step 11: Orders
    console.log('📝 Step 11: Creating Sample Orders...');
    const orders = await seedOrders();
    console.log('✓ Orders created\n');

    // Step 12: Inventory
    console.log('📝 Step 12: Creating Inventory Records...');
    const inventory = await seedInventory();
    console.log('✓ Inventory created\n');

    // Step 13: Invoices
    console.log('📝 Step 13: Creating Invoices...');
    const invoices = await seedInvoices();
    console.log('✓ Invoices created\n');

    // Step 14: Visits
    console.log('📝 Step 14: Creating Field Visits...');
    const visits = await seedVisits();
    console.log('✓ Visits created\n');

    // Step 15: Attendance
    console.log('📝 Step 15: Creating Attendance Records...');
    const attendance = await seedAttendance();
    console.log('✓ Attendance records created\n');

    // Step 16: Activity and engagement data
    console.log('📝 Step 16: Creating Activity and Engagement Data...');
    const activity = await seedActivity();
    console.log('✓ Activity data created\n');

    // Step 17: Registration Applications
    console.log('📝 Step 17: Creating Registration Applications...');
    const registrations = await seedRegistrations();
    console.log('✓ Registration applications created\n');

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Get actual counts from database using mongoose.model()
    const Permission = mongoose.model('Permission');
    const Role = mongoose.model('Role');
    const Company = mongoose.model('Company');
    const Distributor = mongoose.model('Distributor');
    const Retailer = mongoose.model('Retailer');
    const Product = mongoose.model('Product');
    const Salesman = mongoose.model('Salesman');
    const DistributorProductPrice = mongoose.model('DistributorProductPrice');
    const UserModel = mongoose.model('User');
    const Order = mongoose.model('Order');
    const Inventory = mongoose.model('Inventory');
    const Invoice = mongoose.model('Invoice');
    const Visit = mongoose.model('Visit');
    const RegistrationRequest = mongoose.model('RegistrationRequest');
    const Sample = mongoose.model('Sample');
    const Review = mongoose.model('Review');
    const Story = mongoose.model('Story');
    const Payment = mongoose.model('Payment');
    const Analytics = mongoose.model('Analytics');

    const permissionCount = await Permission.countDocuments();
    const roleCount = await Role.countDocuments();
    const superAdminCount = await UserModel.countDocuments({ role: 'super-admin' });
    const companyCount = await Company.countDocuments();
    const distributorCount = await Distributor.countDocuments();
    const retailerCount = await Retailer.countDocuments();
    const productCount = await Product.countDocuments();
    const salesmanCount = await Salesman.countDocuments();
    const pricingCount = await DistributorProductPrice.countDocuments();
    const userCount = await UserModel.countDocuments();
    const orderCount = await Order.countDocuments();
    const inventoryCount = await Inventory.countDocuments();
    const invoiceCount = await Invoice.countDocuments();
    const visitCount = await Visit.countDocuments();
    const registrationCount = await RegistrationRequest.countDocuments();
    const sampleCount = await Sample.countDocuments();
    const reviewCount = await Review.countDocuments();
    const storyCount = await Story.countDocuments();
    const paymentCount = await Payment.countDocuments();
    const analyticsCount = await Analytics.countDocuments();

    console.log(`${'='.repeat(70)}`);
    console.log('✅ Seeding Complete!');
    console.log(`${'='.repeat(70)}`);
    console.log(`\n📊 Summary:\n`);
    console.log(`  ✓ Permissions: ${permissionCount}`);
    console.log(`  ✓ Roles: ${roleCount}`);
    console.log(`  ✓ Super Admin: ${superAdminCount}`);
    console.log(`  ✓ Companies: ${companyCount}`);
    console.log(`  ✓ Distributors: ${distributorCount}`);
    console.log(`  ✓ Retailers: ${retailerCount}`);
    console.log(`  ✓ Products: ${productCount}`);
    console.log(`  ✓ Salesmen: ${salesmanCount}`);
    console.log(`  ✓ Pricing Rules: ${pricingCount}`);
    console.log(`  ✓ Users: ${userCount}`);
    console.log(`  ✓ Orders: ${orderCount}`);
    console.log(`  ✓ Inventory Records: ${inventoryCount}`);
    console.log(`  ✓ Invoices: ${invoiceCount}`);
    console.log(`  ✓ Visits: ${visitCount}`);
    console.log(`  ✓ Samples: ${sampleCount}`);
    console.log(`  ✓ Reviews: ${reviewCount}`);
    console.log(`  ✓ Stories: ${storyCount}`);
    console.log(`  ✓ Payments: ${paymentCount}`);
    console.log(`  ✓ Analytics Snapshots: ${analyticsCount}`);
    console.log(`  ✓ Registration Applications: ${registrationCount}`);
    console.log(`\n⏱️  Completed in ${duration}s\n`);

    console.log('🔐 Default Credentials:\n');
    console.log('  Super Admin:');
    console.log('    Email: admin@b2bconnect.in');
    console.log('    Password: B2BConnect@2026\n');
    console.log('  Company Admin:');
    console.log('    Email: admin@arrvi.com');
    console.log('    Password: User@2026\n');
    console.log('  Distributor Admins:');
    console.log('    Email: admin1@distributors.com, admin2@distributors.com, admin3@distributors.com');
    console.log('    Password: User@2026\n');
    console.log('  Salesmen: Use assigned email addresses');
    console.log('    Password: User@2026\n');

    return {
      permissions,
      roles,
      superAdmin,
      companies,
      distributors,
      retailers,
      products,
      salesmen,
      pricing,
      users,
      orders,
      inventory,
      invoices,
      visits,
      activity,
      registrations,
    };
  } catch (error) {
    console.error('\n❌ Seeding failed:', error instanceof Error ? error.message : String(error));
    console.error(error);
    throw error;
  }
}

// Execute
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/b2bconnect')
  .then(() => {
    console.log('Connected to MongoDB');
    return runSeeder();
  })
  .then(() => {
    console.log('Seeding successful');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
