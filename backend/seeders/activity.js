const Sample = require('../models/Sample');
const Review = require('../models/Review');
const Story = require('../models/Story');
const Payment = require('../models/Payment');
const Analytics = require('../models/Analytics');
const Company = require('../models/Company');
const Retailer = require('../models/Retailer');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedActivity = async () => {
  try {
    const [existingSamples, existingReviews, existingStories, existingPayments, existingAnalytics] = await Promise.all([
      Sample.countDocuments(),
      Review.countDocuments(),
      Story.countDocuments(),
      Payment.countDocuments(),
      Analytics.countDocuments(),
    ]);

    if (existingSamples > 0 || existingReviews > 0 || existingStories > 0 || existingPayments > 0 || existingAnalytics > 0) {
      console.log('✓ Activity data already exists');
      return [];
    }

    const company = await Company.findOne({ tenantId: '000000000000000000000001' });
    const retailers = await Retailer.find({ tenantId: '000000000000000000000001' });
    const products = await Product.find({ tenantId: '000000000000000000000001' });
    const orders = await Order.find({ tenantId: '000000000000000000000001' }).limit(20);

    if (!company || retailers.length === 0 || products.length === 0) {
      throw new Error('Required entities not found. Seed companies, retailers and products first.');
    }

    const samples = [];
    const reviews = [];
    const stories = [];
    const payments = [];
    const analytics = [];

    for (let i = 0; i < 10; i++) {
      const retailer = retailers[i % retailers.length];
      const product = products[i % products.length];
      samples.push({
        tenantId: '000000000000000000000001',
        retailerId: retailer._id.toString(),
        distributorId: retailer.distributorId?.toString(),
        companyId: company._id.toString(),
        productId: product._id.toString(),
        quantity: 5 + i,
        status: i % 3 === 0 ? 'delivered' : 'approved',
        approvalNotes: 'Approved for pilot retail test.',
      });

      reviews.push({
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        productId: product._id.toString(),
        retailerId: retailer._id.toString(),
        rating: 4 + (i % 2),
        comment: 'Reliable quality and steady demand in our store.',
        feedbackType: i % 2 === 0 ? 'positive' : 'neutral',
        verified: true,
      });
    }

    stories.push({
      tenantId: '000000000000000000000001',
      companyId: company._id.toString(),
      type: 'story',
      title: 'Summer care essentials are trending',
      contentUrl: 'https://images.example.com/story-1.jpg',
      thumbnailUrl: 'https://images.example.com/story-1-thumb.jpg',
      cta: { text: 'View collection', action: 'open-catalog' },
      targetAudience: ['retailers', 'distributors'],
      status: 'published',
      viewCount: 1820,
      clickCount: 412,
      orderConversions: 83,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    stories.push({
      tenantId: '000000000000000000000001',
      companyId: company._id.toString(),
      type: 'banner',
      title: 'Festival bundle offer',
      contentUrl: 'https://images.example.com/banner-1.jpg',
      thumbnailUrl: 'https://images.example.com/banner-1-thumb.jpg',
      cta: { text: 'Claim offer', action: 'open-offer' },
      targetAudience: ['retailers'],
      status: 'published',
      viewCount: 940,
      clickCount: 221,
      orderConversions: 41,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    for (const order of orders) {
      payments.push({
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        invoiceId: `INV-${order._id.toString().slice(-4)}`,
        orderId: order._id.toString(),
        retailerId: order.retailerId,
        distributorId: order.distributorId,
        amount: order.total,
        method: ['upi', 'bank-transfer', 'cash'][Math.floor(Math.random() * 3)],
        referenceNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'reconciled',
        paidAt: new Date(order.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000),
      });
    }

    for (const product of products.slice(0, 6)) {
      analytics.push({
        tenantId: '000000000000000000000001',
        companyId: company._id.toString(),
        entityType: 'product',
        entityId: product._id.toString(),
        metricType: 'sales',
        value: 120 + Math.floor(Math.random() * 80),
        timeBucket: 'monthly',
        date: new Date(),
      });
    }

    await Promise.all([
      Sample.insertMany(samples),
      Review.insertMany(reviews),
      Story.insertMany(stories),
      Payment.insertMany(payments),
      Analytics.insertMany(analytics),
    ]);

    console.log('✓ Created activity and engagement data');
    return { samples, reviews, stories, payments, analytics };
  } catch (error) {
    console.error('✗ Error seeding activity data:', error.message);
    throw error;
  }
};

module.exports = seedActivity;
