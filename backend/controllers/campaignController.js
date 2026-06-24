const Advertisement = require('../models/Advertisement');

// Get campaigns/ads
const getCampaigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const campaigns = await Advertisement.find({ tenantId: req.tenantId, companyId: req.user.companyId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Advertisement.countDocuments({ tenantId: req.tenantId, companyId: req.user.companyId });

    res.json({ success: true, data: campaigns, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create campaign
const createCampaign = async (req, res) => {
  try {
    const { mediaUrl } = req.body;
    if (!mediaUrl) return res.status(400).json({ success: false, message: 'mediaUrl is required' });

    const campaign = new Advertisement({
      ...req.body,
      tenantId: req.tenantId,
      companyId: req.user.companyId,
    });

    await campaign.save();
    res.status(201).json({ success: true, data: campaign, message: 'Campaign created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update campaign
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Advertisement.findOneAndUpdate(
      { _id: req.params.campaignId, tenantId: req.tenantId, companyId: req.user.companyId },
      req.body,
      { new: true }
    );
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, data: campaign, message: 'Campaign updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete campaign
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Advertisement.findOneAndDelete({ _id: req.params.campaignId, tenantId: req.tenantId, companyId: req.user.companyId });
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCampaigns, createCampaign, updateCampaign, deleteCampaign };
