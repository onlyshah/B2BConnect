const Visit = require('../models/Visit');
const Company = require('../models/Company');
const Salesman = require('../models/Salesman');
const Retailer = require('../models/Retailer');
const Distributor = require('../models/Distributor');
const Product = require('../models/Product');

const seedVisits = async () => {
  try {
    const existingCount = await Visit.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Visits already exist');
      return [];
    }

    const company = await Company.findOne({ tenantId: '000000000000000000000001' });
    const salesmen = await Salesman.find({ tenantId: company._id });
    const retailers = await Retailer.find({ tenantId: '000000000000000000000001' });
    const distributors = await Distributor.find({ tenantId: '000000000000000000000001' });
    const products = await Product.find({ tenantId: '000000000000000000000001' });

    if (!company || salesmen.length === 0 || retailers.length === 0 || distributors.length === 0 || products.length === 0) {
      throw new Error('Required entities not found. Seed companies, salesmen, retailers, distributors and products first.');
    }

    const purposes = ['order-collection', 'product-demo', 'feedback', 'stock-check', 'retailer-onboarding'];
    const outcomes = ['completed', 'pending', 'cancelled'];
    const visits = [];

    for (let i = 0; i < 18; i++) {
      const salesman = salesmen[i % salesmen.length];
      const retailer = retailers[i % retailers.length];
      const distributor = distributors[i % distributors.length];
      const selectedProducts = products.slice(i % 3, (i % 3) + 3).map((product) => product._id);
      const visitDate = new Date(Date.now() - (i + 3) * 24 * 60 * 60 * 1000);
      const checkInTime = new Date(visitDate);
      const checkOutTime = new Date(visitDate.getTime() + 45 * 60 * 1000);

      visits.push({
        tenantId: company._id,
        salesman: salesman._id,
        retailer: retailer._id,
        distributor: distributor._id,
        visitDate,
        checkInTime,
        checkOutTime,
        durationMinutes: 45 + (i % 5) * 10,
        geoLocation: {
          type: 'Point',
          coordinates: [77.2 + (i % 3) * 0.01, 28.6 + (i % 2) * 0.01],
        },
        purpose: purposes[i % purposes.length],
        discussionNotes: `Discussed ${selectedProducts.length} relevant product lines and reviewed replenishment needs for the outlet.`,
        productsShown: selectedProducts,
        visitOutcome: outcomes[i % outcomes.length],
        competitorProducts: [
          {
            brand: 'BrandX',
            product: 'Lite Wash',
            price: 95 + (i % 3) * 10,
            feedback: 'Price sensitive but open to trials.',
          },
        ],
        photos: [],
      });
    }

    const created = await Visit.insertMany(visits);
    console.log(`✓ Created ${created.length} visits`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding visits:', error.message);
    throw error;
  }
};

module.exports = seedVisits;
