// Performance controller - stub implementation
const getPerformanceMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    res.json({
      success: true,
      data: {
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        period: { startDate, endDate },
      },
      message: 'Get performance metrics',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSalesmanPerformance = async (req, res) => {
  try {
    const { salesmanId } = req.params;

    res.json({
      success: true,
      data: {
        salesmanId,
        totalVisits: 0,
        totalOrders: 0,
        totalSales: 0,
        avgOrderValue: 0,
      },
      message: 'Get salesman performance',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPerformanceMetrics,
  getSalesmanPerformance,
};
