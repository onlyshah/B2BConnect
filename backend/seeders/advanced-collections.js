const Company = require('../models/Company');
const Product = require('../models/Product');
const ProductLaunch = require('../models/ProductLaunch');
const ProductMedia = require('../models/ProductMedia');
const Retailer = require('../models/Retailer');
const Story = require('../models/Story');
const StoryView = require('../models/StoryView');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const Poll = require('../models/Poll');
const PollResponse = require('../models/PollResponse');

const seedAdvancedCollections = async () => {
  try {
    const company = await Company.findOne({}).lean();
    if (!company) return [];

    const products = await Product.find({ companyId: company._id }).limit(4).lean();
    const retailers = await Retailer.find({ companyId: company._id }).limit(3).lean();
    const stories = await Story.find({ companyId: company._id }).limit(3).lean();

    const created = [];

    if (products.length > 0) {
      const existingLaunches = await ProductLaunch.countDocuments({ companyId: company._id });
      if (existingLaunches === 0) {
        const launches = products.slice(0, 2).map((product, index) => ({
          companyId: company._id,
          productId: product._id,
          launchTitle: `${product.name} Launch Campaign`,
          launchVideoUrl: `https://cdn.example.com/${product.sku.toLowerCase()}-launch.mp4`,
          launchDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000),
          status: 'upcoming',
          totalInterestedCount: 24 + index * 6,
          totalPreBookedQty: 80 + index * 20,
        }));
        const inserted = await ProductLaunch.insertMany(launches);
        created.push(...inserted);
      }

      const existingMedia = await ProductMedia.countDocuments({ companyId: company._id });
      if (existingMedia === 0) {
        const mediaItems = products.slice(0, 3).flatMap((product, index) => [
          {
            companyId: company._id,
            productId: product._id,
            mediaType: 'image',
            url: `https://cdn.example.com/${product.sku.toLowerCase()}-1.jpg`,
            durationSeconds: 0,
            displayOrder: index * 10,
          },
          {
            companyId: company._id,
            productId: product._id,
            mediaType: 'video',
            url: `https://cdn.example.com/${product.sku.toLowerCase()}-demo.mp4`,
            durationSeconds: 45,
            displayOrder: index * 10 + 1,
          },
        ]);
        const inserted = await ProductMedia.insertMany(mediaItems);
        created.push(...inserted);
      }
    }

    if (retailers.length > 0) {
      const existingLoyalty = await LoyaltyTransaction.countDocuments({ companyId: company._id });
      if (existingLoyalty === 0) {
        const loyaltyEntries = retailers.map((retailer, index) => ({
          companyId: company._id,
          retailerId: retailer._id,
          points: 120 + index * 40,
          sourceAction: index % 2 === 0 ? 'order_placed' : 'review_submitted',
          referenceId: retailer._id,
          notes: 'Automated loyalty credit',
        }));
        const inserted = await LoyaltyTransaction.insertMany(loyaltyEntries);
        created.push(...inserted);
      }
    }

    if (stories.length > 0) {
      const existingViews = await StoryView.countDocuments();
      if (existingViews === 0 && retailers.length > 0) {
        const storyViews = stories.slice(0, 2).flatMap((story, index) => retailers.slice(0, 2).map((retailer) => ({
          storyId: story._id,
          retailerId: retailer._id,
          viewedAt: new Date(Date.now() - (index + 1) * 2 * 24 * 60 * 60 * 1000),
        })));
        const inserted = await StoryView.insertMany(storyViews);
        created.push(...inserted);
      }
    }

    const existingPolls = await Poll.countDocuments({ companyId: company._id });
    if (existingPolls === 0) {
      const poll = await Poll.create({
        companyId: company._id,
        type: 'product_voting',
        title: 'Preferred beverage flavor for next launch',
        description: 'Collect retailer feedback on upcoming product flavors',
        questions: [{ question: 'Which flavor should we prioritize next?', inputType: 'single', options: ['Mango', 'Guava', 'Lemon'] }],
        status: 'active',
      });
      created.push(poll);

      if (retailers.length > 0) {
        const responses = retailers.slice(0, 2).map((retailer) => ({
          pollId: poll._id,
          retailerId: retailer._id,
          answers: [{ question: 'Which flavor should we prioritize next?', answer: 'Mango' }],
        }));
        const inserted = await PollResponse.insertMany(responses);
        created.push(...inserted);
      }
    }

    return created;
  } catch (error) {
    console.error('✗ Error seeding advanced collections:', error.message);
    throw error;
  }
};

module.exports = seedAdvancedCollections;
