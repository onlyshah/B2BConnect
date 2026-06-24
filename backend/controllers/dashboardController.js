const Product = require('../models/Product');
const Order = require('../models/Order');
const Retailer = require('../models/Retailer');
const Salesman = require('../models/Salesman');
const Inventory = require('../models/Inventory');

// Get dashboard data
const getDashboard = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    // Get metrics from database
    const totalProducts = await Product.countDocuments({ tenantId });
    const totalRetailers = await Retailer.countDocuments({ tenantId });
    const totalSalesmen = await Salesman.countDocuments({ tenantId });
    const totalOrders = await Order.countDocuments({ tenantId });

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ordersToday = await Order.countDocuments({
      tenantId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Get total sales this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const totalSalesThisMonth = await Order.aggregate([
      {
        $match: {
          tenantId,
          createdAt: { $gte: monthStart },
          status: { $in: ['approved', 'dispatched', 'delivered'] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Get low stock items
    const lowStockItems = await Inventory.find({
      tenantId,
      quantity: { $lte: 10 },
    }).limit(5);

    // Get recent orders
    const recentOrders = await Order.find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('retailerId');

    // Get top performing salesmen
    const topSalesmen = await Salesman.find({ tenantId })
      .sort({ 'metrics.totalSales': -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        metrics: {
          totalProducts,
          totalRetailers,
          totalSalesmen,
          totalOrders,
          ordersToday,
          totalSalesThisMonth: totalSalesThisMonth[0]?.total || 0,
        },
        lowStockItems: lowStockItems.length,
        recentOrders,
        topSalesmen,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard widgets configuration from database
const getDashboardWidgets = async (req, res) => {
  try {
    // This would be loaded from a database collection
    // For now, returning static configuration
    const widgets = [
      {
        id: 'total_products',
        title: 'Total Products',
        type: 'kpi',
        permission: 'product.view',
      },
      {
        id: 'total_retailers',
        title: 'Total Retailers',
        type: 'kpi',
        permission: 'retailer.view',
      },
      {
        id: 'total_orders',
        title: 'Total Orders',
        type: 'kpi',
        permission: 'order.view',
      },
      {
        id: 'recent_orders',
        title: 'Recent Orders',
        type: 'table',
        permission: 'order.view',
      },
    ];

    res.json({ success: true, data: widgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  getDashboardWidgets,
};
