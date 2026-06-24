const Story = require('../models/Story');

// Get all stories
const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stories = await Story.find({ tenantId: req.tenantId, status: 'published' })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Story.countDocuments({
      tenantId: req.tenantId,
      status: 'published',
    });

    res.json({
      success: true,
      data: stories,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create story
const createStory = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const story = new Story({
      ...req.body,
      tenantId: req.tenantId,
      status: 'draft',
    });

    await story.save();

    res.status(201).json({ success: true, data: story, message: 'Story created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update story
const updateStory = async (req, res) => {
  try {
    const story = await Story.findOneAndUpdate(
      { _id: req.params.storyId, tenantId: req.tenantId },
      req.body,
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    res.json({ success: true, data: story, message: 'Story updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Record story view
const viewStory = async (req, res) => {
  try {
    const story = await Story.findOneAndUpdate(
      { _id: req.params.storyId, tenantId: req.tenantId },
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    res.json({ success: true, data: story, message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStories,
  createStory,
  updateStory,
  viewStory,
};
