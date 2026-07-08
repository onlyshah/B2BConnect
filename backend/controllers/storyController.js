const Story = require('../models/Story');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

function buildStoryFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const stories = await Story.find({ ...buildStoryFilter(req), status: 'published' }).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Story.countDocuments({ ...buildStoryFilter(req), status: 'published' });
    res.json({ success: true, data: stories, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createStory = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content are required' });
    const story = new Story({ ...req.body, tenantId: req.tenantId, companyId: resolveCompanyId(req), status: 'draft' });
    await story.save();
    res.status(201).json({ success: true, data: story, message: 'Story created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStory = async (req, res) => {
  try {
    const story = await Story.findOneAndUpdate({ _id: req.params.storyId, ...buildStoryFilter(req) }, req.body, { new: true });
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    res.json({ success: true, data: story, message: 'Story updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewStory = async (req, res) => {
  try {
    const story = await Story.findOneAndUpdate({ _id: req.params.storyId, ...buildStoryFilter(req) }, { $inc: { viewCount: 1 } }, { new: true });
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    res.json({ success: true, data: story, message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStories, createStory, updateStory, viewStory };
