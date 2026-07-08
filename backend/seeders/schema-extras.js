const mongoose = require('mongoose');
const Company = require('../models/Company');
const Distributor = require('../models/Distributor');
const Retailer = require('../models/Retailer');
const Salesman = require('../models/Salesman');
const Product = require('../models/Product');

const Campaign = require('../models/Campaign');
const ProductCategory = require('../models/ProductCategory');
const RetailerCategory = require('../models/RetailerCategory');
const ProductMedia = require('../models/ProductMedia');
const ProductLaunch = require('../models/ProductLaunch');
const DemandForecastResponse = require('../models/DemandForecastResponse');
const StoryView = require('../models/StoryView');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const BillingInvoice = require('../models/BillingInvoice');
const OnboardingRequest = require('../models/OnboardingRequest');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const Poll = require('../models/Poll');
const PollResponse = require('../models/PollResponse');
const SalesmanAssignment = require('../models/SalesmanAssignment');
const SalesmanTarget = require('../models/SalesmanTarget');
const SalesmanFollowup = require('../models/SalesmanFollowup');
const SalesmanFeedback = require('../models/SalesmanFeedback');
const SalesmanCompetitorReport = require('../models/SalesmanCompetitorReport');
const SalesmanPerformance = require('../models/SalesmanPerformance');
const SalesmanIncentive = require('../models/SalesmanIncentive');
const SalesmanRetailerScore = require('../models/SalesmanRetailerScore');
const DistributorOrder = require('../models/DistributorOrder');
const AnalyticsDistributorPerformance = require('../models/AnalyticsDistributorPerformance');

function pick(list, index) {
  if (!list.length) return null;
  return list[index % list.length];
}

async function seedSchemaExtras() {
  const company = await Company.findOne().sort({ createdAt: 1 });
  const distributors = await Distributor.find().limit(6);
  const retailers = await Retailer.find().limit(8);
  const salesmen = await Salesman.find().limit(8);
  const products = await Product.find().limit(8);

  if (!company) {
    throw new Error('Seed companies before schema extras.');
  }

  const extras = [];

  if ((await SubscriptionPlan.countDocuments()) === 0) {
    extras.push(SubscriptionPlan.insertMany([
      { planName: 'Starter', maxRetailers: 50, maxDistributors: 1, maxSalesmen: 5, priceMonthly: 4999, features: ['orders', 'reports', 'support'] },
      { planName: 'Growth', maxRetailers: 250, maxDistributors: 5, maxSalesmen: 25, priceMonthly: 14999, features: ['orders', 'analytics', 'campaigns', 'collections'] },
      { planName: 'Enterprise', maxRetailers: 1000, maxDistributors: 25, maxSalesmen: 200, priceMonthly: 49999, features: ['multi-warehouse', 'audit-logs', 'api-access', 'custom-roles'] }
    ]));
  }

  if ((await ProductCategory.countDocuments()) === 0) {
    extras.push(ProductCategory.insertMany([
      { companyId: company._id, categoryName: 'Skin Care' },
      { companyId: company._id, categoryName: 'Hair Care' },
      { companyId: company._id, categoryName: 'Oral Care' },
      { companyId: company._id, categoryName: 'Beverages' }
    ]));
  }

  if ((await RetailerCategory.countDocuments()) === 0) {
    extras.push(RetailerCategory.insertMany([
      { companyId: company._id, categoryName: 'Silver', defaultDiscountPercent: 2, defaultCreditLimit: 25000, defaultCreditDays: 15, loyaltyPointMultiplier: 1 },
      { companyId: company._id, categoryName: 'Gold', defaultDiscountPercent: 4, defaultCreditLimit: 75000, defaultCreditDays: 21, loyaltyPointMultiplier: 1.25 },
      { companyId: company._id, categoryName: 'Platinum', defaultDiscountPercent: 6, defaultCreditLimit: 150000, defaultCreditDays: 30, loyaltyPointMultiplier: 1.5 }
    ]));
  }

  if ((await Campaign.countDocuments()) === 0) {
    const firstProduct = pick(products, 0);
    const secondProduct = pick(products, 1);
    const firstDistributor = pick(distributors, 0);
    if (firstProduct && firstDistributor) {
      extras.push(Campaign.insertMany([
        {
          companyId: company._id,
          campaignName: 'Summer Retail Push',
          linkedAdIds: [],
          linkedSchemeIds: [],
          startDate: new Date('2025-04-01'),
          endDate: new Date('2025-06-30'),
          status: 'active',
          budget: 250000,
          totalImpressions: 125000,
          totalClicks: 8400,
          totalConversions: 610
        },
        {
          companyId: company._id,
          campaignName: 'Festive Launch Drive',
          linkedAdIds: [],
          linkedSchemeIds: [],
          startDate: new Date('2025-09-01'),
          endDate: new Date('2025-11-30'),
          status: 'draft',
          budget: 350000,
          totalImpressions: 0,
          totalClicks: 0,
          totalConversions: 0
        }
      ]));

      if (firstProduct) {
        extras.push(ProductMedia.insertMany([
          { companyId: company._id, productId: firstProduct._id, mediaType: 'image', url: 'https://picsum.photos/seed/product-media-1/800/600', displayOrder: 1 },
          { companyId: company._id, productId: firstProduct._id, mediaType: 'pdf_brochure', url: 'https://example.com/brochure.pdf', displayOrder: 2 }
        ]));
      }

      if (firstProduct) {
        extras.push(ProductLaunch.insertMany([
          { companyId: company._id, productId: firstProduct._id, launchTitle: 'Monsoon Care Launch', launchVideoUrl: 'https://example.com/launch.mp4', launchDate: new Date('2025-07-15'), status: 'live', totalInterestedCount: 128, totalPreBookedQty: 4300 },
          ...(secondProduct ? [{ companyId: company._id, productId: secondProduct._id, launchTitle: 'Festive Refresh Launch', launchVideoUrl: 'https://example.com/launch2.mp4', launchDate: new Date('2025-09-15'), status: 'upcoming', totalInterestedCount: 52, totalPreBookedQty: 1200 }] : [])
        ]));
      }
    }
  }

  if (retailers.length && products.length && (await DemandForecastResponse.countDocuments()) === 0) {
    const launches = await ProductLaunch.find().limit(2);
    const forecastRows = [];
    launches.forEach((launch, launchIndex) => {
      retailers.slice(0, 3).forEach((retailer, retailerIndex) => {
        forecastRows.push({
          companyId: company._id,
          productLaunchId: launch._id,
          retailerId: retailer._id,
          submittedBySalesmanId: pick(salesmen, retailerIndex)?._id || null,
          interested: true,
          expectedMonthlyQty: 120 + launchIndex * 40 + retailerIndex * 25,
          region: retailer.location?.city || 'Mumbai'
        });
      });
    });
    extras.push(DemandForecastResponse.insertMany(forecastRows));
  }

  if (retailers.length && (await StoryView.countDocuments()) === 0) {
    const stories = await mongoose.model('Story').find().limit(2);
    const views = [];
    stories.forEach((story) => {
      retailers.slice(0, 4).forEach((retailer) => {
        views.push({
          storyId: story._id,
          retailerId: retailer._id,
          viewedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
        });
      });
    });
    if (views.length) extras.push(StoryView.insertMany(views));
  }

  if ((await BillingInvoice.countDocuments()) === 0) {
    const plans = await SubscriptionPlan.find().limit(3);
    extras.push(BillingInvoice.insertMany(plans.map((plan, index) => ({
      companyId: company._id,
      planId: plan._id,
      invoiceNumber: `BIL-${company.name.replace(/\s+/g, '').slice(0, 4).toUpperCase()}-${index + 1}`,
      amount: plan.priceMonthly,
      status: index === 0 ? 'paid' : 'issued',
      dueDate: new Date(Date.now() + (index + 1) * 15 * 24 * 60 * 60 * 1000),
      paidAt: index === 0 ? new Date() : null,
      notes: 'Monthly subscription billing'
    }))));
  }

  if ((await OnboardingRequest.countDocuments()) === 0) {
    extras.push(OnboardingRequest.insertMany([
      {
        type: 'retailer',
        fullName: 'Nilesh Patel',
        email: 'nilesh.patel@patelstores.in',
        phone: '+91-9890112233',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411014',
        status: 'pending'
      },
      {
        type: 'salesman',
        fullName: 'Suresh Kumar',
        email: 'suresh.kumar@salesforce.in',
        phone: '+91-9890445566',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682001',
        status: 'approved'
      }
    ]));
  }

  if (retailers.length && (await LoyaltyTransaction.countDocuments()) === 0) {
    extras.push(LoyaltyTransaction.insertMany(
      retailers.slice(0, 4).map((retailer, index) => ({
        companyId: company._id,
        retailerId: retailer._id,
        points: 150 + index * 40,
        sourceAction: index % 2 === 0 ? 'order_placed' : 'review_submitted',
        notes: 'Monthly rewards accrual'
      }))
    ));
  }

  if (retailers.length && (await Poll.countDocuments()) === 0) {
    const poll = await Poll.create({
      companyId: company._id,
      type: 'survey',
      title: 'Retailer Service Pulse',
      description: 'Quarterly service and assortment feedback',
      questions: [
        { question: 'How satisfied are you with order fulfillment?', inputType: 'rating', options: ['1', '2', '3', '4', '5'] },
        { question: 'Which category needs better availability?', inputType: 'single', options: ['Skin Care', 'Hair Care', 'Oral Care', 'Beverages'] }
      ],
      status: 'active',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-07-31')
    });
    extras.push(PollResponse.insertMany(retailers.slice(0, 3).map((retailer, index) => ({
      pollId: poll._id,
      retailerId: retailer._id,
      answers: [String(4 - index), 'Skin Care']
    }))));
  }

  if (salesmen.length && retailers.length && (await SalesmanAssignment.countDocuments()) === 0) {
    extras.push(SalesmanAssignment.insertMany(
      salesmen.slice(0, 4).flatMap((salesman, salesmanIndex) =>
        retailers.slice(salesmanIndex, salesmanIndex + 2).map((retailer) => ({
          companyId: company._id,
          salesmanId: salesman._id,
          retailerId: retailer._id,
          isActive: true
        }))
      )
    ));
  }

  if (salesmen.length && (await SalesmanTarget.countDocuments()) === 0) {
    extras.push(SalesmanTarget.insertMany(
      salesmen.slice(0, 4).map((salesman, index) => ({
        companyId: company._id,
        salesmanId: salesman._id,
        periodType: 'monthly',
        targetVisits: 180 + index * 20,
        actualVisits: 140 + index * 18,
        targetOrders: 45 + index * 5,
        actualOrders: 31 + index * 4
      }))
    ));
  }

  if (salesmen.length && retailers.length && (await SalesmanFollowup.countDocuments()) === 0) {
    extras.push(SalesmanFollowup.insertMany([
      {
        companyId: company._id,
        salesmanId: salesmen[0]._id,
        retailerId: retailers[0]._id,
        followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'open',
        notes: 'Discuss range extension and new launch pack'
      },
      {
        companyId: company._id,
        salesmanId: salesmen[1] ? salesmen[1]._id : salesmen[0]._id,
        retailerId: retailers[1] ? retailers[1]._id : retailers[0]._id,
        followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'open',
        notes: 'Resolve pending visibility claim'
      }
    ]));
  }

  if (salesmen.length && retailers.length && (await SalesmanFeedback.countDocuments()) === 0) {
    extras.push(SalesmanFeedback.insertMany([
      {
        companyId: company._id,
        salesmanId: salesmen[0]._id,
        retailerId: retailers[0]._id,
        feedbackType: 'assortment',
        feedbackText: 'Retailer wants a larger pack for the summer campaign.'
      }
    ]));
  }

  if (salesmen.length && retailers.length && (await SalesmanCompetitorReport.countDocuments()) === 0) {
    extras.push(SalesmanCompetitorReport.insertMany([
      {
        companyId: company._id,
        salesmanId: salesmen[0]._id,
        retailerId: retailers[0]._id,
        competitorBrand: 'GlowAura',
        competitorPrice: 185,
        notes: 'Competitor slightly underpriced in local market'
      }
    ]));
  }

  if (salesmen.length && (await SalesmanPerformance.countDocuments()) === 0) {
    extras.push(SalesmanPerformance.insertMany(
      salesmen.slice(0, 4).map((salesman, index) => ({
        companyId: company._id,
        salesmanId: salesman._id,
        periodStart: new Date('2025-06-01'),
        periodEnd: new Date('2025-06-30'),
        overallScore: 72 + index * 4,
        totalVisits: 140 + index * 15,
        totalOrders: 32 + index * 3,
        totalRevenue: 950000 + index * 125000
      }))
    ));
  }

  if (salesmen.length && (await SalesmanIncentive.countDocuments()) === 0) {
    extras.push(SalesmanIncentive.insertMany(
      salesmen.slice(0, 3).map((salesman, index) => ({
        companyId: company._id,
        salesmanId: salesman._id,
        periodStart: new Date('2025-06-01'),
        periodEnd: new Date('2025-06-30'),
        totalIncentive: 4500 + index * 1250,
        payoutStatus: index === 0 ? 'paid' : 'approved'
      }))
    ));
  }

  if (salesmen.length && retailers.length && (await SalesmanRetailerScore.countDocuments()) === 0) {
    extras.push(SalesmanRetailerScore.insertMany([
      {
        companyId: company._id,
        salesmanId: salesmen[0]._id,
        retailerId: retailers[0]._id,
        totalScore: 88,
        factors: { visits: 5, orders: 3, service: 4 }
      }
    ]));
  }

  if (distributors.length && products.length && (await DistributorOrder.countDocuments()) === 0) {
    const distributor = distributors[0];
    const lineItems = products.slice(0, 3).map((product, index) => ({
      productId: product._id,
      quantity: 25 + index * 10,
      unitPrice: Number(product.mrp || 100) * 0.68
    }));
    const grandTotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    extras.push(DistributorOrder.insertMany([
      {
        companyId: company._id,
        distributorId: distributor._id,
        items: lineItems,
        grandTotal,
        status: 'approved'
      }
    ]));
  }

  if (distributors.length && (await AnalyticsDistributorPerformance.countDocuments()) === 0) {
    extras.push(AnalyticsDistributorPerformance.insertMany(
      distributors.slice(0, 3).map((distributor, index) => ({
        companyId: company._id,
        distributorId: distributor._id,
        periodStart: new Date('2025-06-01'),
        periodEnd: new Date('2025-06-30'),
        fulfillmentRate: 91 - index * 3,
        overallScore: 84 - index * 2,
        orderCount: 210 + index * 18,
        revenue: 2400000 + index * 350000
      }))
    ));
  }

  const results = await Promise.all(extras);
  return results;
}

module.exports = seedSchemaExtras;
