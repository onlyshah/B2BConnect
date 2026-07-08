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
require('./models/ProductCategory');
require('./models/ProductMedia');
require('./models/ProductLaunch');
require('./models/DemandForecastResponse');
require('./models/Retailer');
require('./models/RetailerCategory');
require('./models/Salesman');
require('./models/SalesmanAssignment');
require('./models/SalesmanTarget');
require('./models/SalesmanFollowup');
require('./models/SalesmanFeedback');
require('./models/SalesmanCompetitorReport');
require('./models/SalesmanPerformance');
require('./models/SalesmanIncentive');
require('./models/SalesmanRetailerScore');
require('./models/Territory');
require('./models/Order');
require('./models/DistributorOrder');
require('./models/Visit');
require('./models/CollectionRecord');
require('./models/Inventory');
require('./models/Notification');
require('./models/Story');
require('./models/StoryView');
require('./models/Review');
require('./models/Sample');
require('./models/Scheme');
require('./models/Invoice');
require('./models/Payment');
require('./models/Analytics');
require('./models/AnalyticsDistributorPerformance');
require('./models/DistributorProductPrice');
require('./models/Campaign');
require('./models/SubscriptionPlan');
require('./models/BillingInvoice');
require('./models/RefreshToken');
require('./models/OnboardingRequest');
require('./models/LoyaltyTransaction');
require('./models/Poll');
require('./models/PollResponse');
require('./models/rbac/Permission');
require('./models/rbac/Role');
require('./models/registration/RegistrationRequest');
require('./models/registration/CompanyApplication');
require('./models/registration/DistributorApplication');
require('./models/registration/RetailerApplication');
require('./models/registration/SalesmanApplication');

const { runEnterpriseSeeder, parseSeederOptions } = require('./seeders/enterpriseSeeder');

async function runSeeder() {
  const startTime = Date.now();
  const options = parseSeederOptions(process.argv.slice(2));

  try {
    const result = await runEnterpriseSeeder(options);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    if (result.report.validationErrors.length > 0) {
      console.log(`⚠️  Validation warnings: ${result.report.validationErrors.join('; ')}`);
    }
    console.log(`\n⏱️  Completed in ${duration}s\n`);
    return result;
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
