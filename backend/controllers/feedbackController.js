// Feedback controller for simple feedback collection
// This can be expanded with Feedback model later

const getFeedback = async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'Get feedback list',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {},
      message: 'Get feedback',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { feedback, category } = req.body;

    if (!feedback || !category) {
      return res.status(400).json({
        success: false,
        message: 'Feedback and category are required',
      });
    }

    res.status(201).json({
      success: true,
      data: {
        _id: Date.now(),
        feedback,
        category,
        tenantId: req.tenantId,
        createdAt: new Date(),
      },
      message: 'Feedback created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFeedback,
  getFeedbackById,
  createFeedback,
};
