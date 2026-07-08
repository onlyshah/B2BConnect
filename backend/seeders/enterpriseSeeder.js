const mongoose = require('mongoose');
require('dotenv').config();

const { seedPermissions } = require('./permissions');
const { seedDefaultRoles } = require('./roles');
const seedSuperAdmin = require('./super-admin');
const seedCompanies = require('./companies');
const seedDistributors = require('./distributors');
const seedRetailers = require('./retailers');
const seedProducts = require('./products');
const seedSalesmen = require('./salesmen');
const seedPricing = require('./pricing');
const seedCampaigns = require('./campaigns');
const seedSchemes = require('./schemes');
const seedUsers = require('./users');
const seedOrders = require('./orders');
const seedInventory = require('./inventory');
const seedInvoices = require('./invoices');
const seedRegistrations = require('./registrations');
const seedVisits = require('./visits');
const seedActivity = require('./activity');
const seedAttendance = require('./attendance');
const seedSchemaExtras = require('./schema-extras');
const seedAdvancedCollections = require('./advanced-collections');

const stepDefinitions = [
  { name: 'permissions', seeder: seedPermissions, description: 'RBAC permissions' },
  { name: 'roles', seeder: seedDefaultRoles, description: 'RBAC roles' },
  { name: 'super-admin', seeder: seedSuperAdmin, description: 'Super admin user' },
  { name: 'companies', seeder: seedCompanies, description: 'Companies' },
  { name: 'distributors', seeder: seedDistributors, description: 'Distributors' },
  { name: 'retailers', seeder: seedRetailers, description: 'Retailers' },
  { name: 'products', seeder: seedProducts, description: 'Products' },
  { name: 'salesmen', seeder: seedSalesmen, description: 'Salesmen' },
  { name: 'campaigns', seeder: async () => { await seedCampaigns(); await seedSchemes(); return []; }, description: 'Campaigns and schemes' },
  { name: 'pricing', seeder: seedPricing, description: 'Distributor pricing rules' },
  { name: 'users', seeder: seedUsers, description: 'Business users' },
  { name: 'orders', seeder: seedOrders, description: 'Sales orders' },
  { name: 'inventory', seeder: seedInventory, description: 'Inventory records' },
  { name: 'invoices', seeder: seedInvoices, description: 'Invoices and payments' },
  { name: 'registrations', seeder: seedRegistrations, description: 'Onboarding requests' },
  { name: 'visits', seeder: seedVisits, description: 'Field visits and engagement' },
  { name: 'activity', seeder: seedActivity, description: 'Activity and engagement history' },
  { name: 'attendance', seeder: seedAttendance, description: 'Attendance records' },
  { name: 'schema-extras', seeder: seedSchemaExtras, description: 'Additional schema data' },
  { name: 'advanced-collections', seeder: seedAdvancedCollections, description: 'Product launches, media, loyalty, and poll data' },
];

function parseSeederOptions(argv = []) {
  const rebuild = argv.includes('--rebuild') || argv.includes('rebuild');
  const stepMatch = argv.find((arg) => arg.startsWith('--step='));
  const step = stepMatch ? stepMatch.split('=')[1] : null;
  const validateOnly = argv.includes('--validate-only');
  return { rebuild, step, validateOnly };
}

async function runEnterpriseSeeder(options = {}) {
  const { rebuild = false, step = null, validateOnly = false } = options;

  if (rebuild) {
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Dropped existing database before reseeding');
  }

  const selectedSteps = step
    ? stepDefinitions.filter((entry) => entry.name === step)
    : stepDefinitions;

  if (selectedSteps.length === 0) {
    throw new Error(`Unknown seeding step: ${step}`);
  }

  const results = [];
  if (validateOnly) {
    const report = await buildValidationReport();
    return { steps: [], report };
  }

  console.log(`\n${'='.repeat(72)}`);
  console.log('🌱 Enterprise seeder runner');
  console.log(`${'='.repeat(72)}\n`);

  for (const entry of selectedSteps) {
    console.log(`▶ ${entry.description} (${entry.name})`);
    const startedAt = Date.now();
    const payload = await entry.seeder();
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(2);
    results.push({ name: entry.name, description: entry.description, elapsedSeconds: elapsed, count: Array.isArray(payload) ? payload.length : 0 });
    console.log(`✓ Completed in ${elapsed}s\n`);
  }

  const report = await buildValidationReport();
  console.log(`${'='.repeat(72)}`);
  console.log('📊 Enterprise seeding summary');
  console.log(`${'='.repeat(72)}`);
  console.log(JSON.stringify(report, null, 2));
  console.log(`${'='.repeat(72)}\n`);

  return { steps: results, report };
}

async function buildValidationReport() {
  const models = {
    companies: require('../models/Company'),
    distributors: require('../models/Distributor'),
    retailers: require('../models/Retailer'),
    products: require('../models/Product'),
    salesmen: require('../models/Salesman'),
    users: require('../models/User'),
    orders: require('../models/Order'),
    invoices: require('../models/Invoice'),
    payments: require('../models/Payment'),
    visits: require('../models/Visit'),
    stories: require('../models/Story'),
    campaigns: require('../models/Campaign'),
    advertisements: require('../models/Advertisement'),
  };

  const counts = {};
  for (const [key, model] of Object.entries(models)) {
    counts[key] = await model.countDocuments();
  }

  const emptyCollections = Object.entries(counts)
    .filter(([, value]) => value === 0)
    .map(([name]) => name);

  const missingReferences = [];
  const orders = await models.orders.find({}).lean();
  for (const order of orders) {
    if (!order.companyId || !(await hasDocument(models.companies, order.companyId))) {
      missingReferences.push({ type: 'order', id: order._id.toString(), field: 'companyId' });
    }
    if (!order.distributorId || !(await hasDocument(models.distributors, order.distributorId))) {
      missingReferences.push({ type: 'order', id: order._id.toString(), field: 'distributorId' });
    }
    if (!order.retailerId || !(await hasDocument(models.retailers, order.retailerId))) {
      missingReferences.push({ type: 'order', id: order._id.toString(), field: 'retailerId' });
    }
  }

  const duplicateUsers = await require('../models/User').aggregate([
    { $group: { _id: '$email', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  const validationErrors = [];
  if (emptyCollections.length > 0) {
    validationErrors.push(`Empty collections: ${emptyCollections.join(', ')}`);
  }
  if (missingReferences.length > 0) {
    validationErrors.push(`Broken references: ${missingReferences.length}`);
  }
  if (duplicateUsers.length > 0) {
    validationErrors.push(`Duplicate emails: ${duplicateUsers.length}`);
  }

  return {
    generatedAt: new Date().toISOString(),
    counts,
    emptyCollections,
    missingReferences,
    duplicateRecords: duplicateUsers.map((entry) => ({ email: entry._id, count: entry.count })),
    validationErrors,
  };
}

async function hasDocument(model, id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  const record = await model.findById(id).lean();
  return Boolean(record);
}

module.exports = {
  runEnterpriseSeeder,
  buildValidationReport,
  parseSeederOptions,
  stepDefinitions,
};
