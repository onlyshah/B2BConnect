// Followup controller for follow-up task management
// This can be expanded with Followup model later

const getFollowups = async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'Get follow-ups list',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFollowupById = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {},
      message: 'Get follow-up',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFollowup = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    res.status(201).json({
      success: true,
      data: {
        _id: Date.now(),
        title,
        description,
        dueDate,
        status: 'pending',
        tenantId: req.tenantId,
        createdAt: new Date(),
      },
      message: 'Follow-up created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFollowup = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    res.json({
      success: true,
      data: { _id: req.params.id, status, updatedAt: new Date() },
      message: 'Follow-up updated',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFollowups,
  getFollowupById,
  createFollowup,
  updateFollowup,
};
