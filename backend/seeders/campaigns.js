const Advertisement = require('../models/Advertisement');
const Campaign = require('../models/Campaign');
const Company = require('../models/Company');

const seedCampaigns = async () => {
  try {
    const company = await Company.findOne({ tenantId: '000000000000000000000001' });
    if (!company) throw new Error('Company not found. Seed companies first.');

    const existing = await Campaign.countDocuments({ companyId: company._id }) + await Advertisement.countDocuments({ companyId: company._id });
    if (existing > 0) {
      console.log('✓ Campaigns already exist');
      return [];
    }

    const companyId = company._id;
    const campaigns = [
      {
        companyId,
        campaignName: 'Summer Retail Promotion',
        linkedAdIds: [],
        linkedSchemeIds: [],
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        companyId,
        campaignName: 'New Launch Awareness',
        linkedAdIds: [],
        linkedSchemeIds: [],
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ];

    const createdCampaigns = await Campaign.insertMany(campaigns);
    const advertisements = [
      {
        companyId,
        name: 'Summer Sale Banner',
        adType: 'banner',
        mediaUrl: 'https://picsum.photos/seed/summer/800/300',
        budget: 50000,
        status: 'active',
      },
      {
        companyId,
        name: 'New Launch Featured',
        adType: 'featured',
        mediaUrl: 'https://picsum.photos/seed/launch/800/300',
        budget: 30000,
        status: 'draft',
      },
    ];
    const createdAds = await Advertisement.insertMany(advertisements);
    console.log(`✓ Created ${createdCampaigns.length} campaigns and ${createdAds.length} advertisements`);
    return [...createdCampaigns, ...createdAds];
  } catch (error) {
    console.error('✗ Error seeding campaigns:', error.message);
    throw error;
  }
};

module.exports = seedCampaigns;
