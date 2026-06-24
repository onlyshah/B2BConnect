// Territory controller - stub implementation
const getTerritories = async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'Get territories list',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTerritory = async (req, res) => {
  try {
    const { name, area } = req.body;

    if (!name || !area) {
      return res.status(400).json({
        success: false,
        message: 'Name and area are required',
      });
    }

    res.status(201).json({
      success: true,
      data: {
        _id: Date.now(),
        name,
        area,
        tenantId: req.tenantId,
        createdAt: new Date(),
      },
      message: 'Territory created',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTerritories,
  createTerritory,
};
