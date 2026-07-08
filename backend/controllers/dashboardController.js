const Product = require('../models/Product');
const Order = require('../models/Order');
const Retailer = require('../models/Retailer');
const Salesman = require('../models/Salesman');
const Inventory = require('../models/Inventory');
const resolveCompanyId = (req) => req.user?.companyId || req.query?.companyId || req.tenantId;

function buildDashboardFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

const getDashboard = async (req, res) => {
  try {
    const filter = buildDashboardFilter(req);
    const totalProducts = await Product.countDocuments(filter);
    const totalRetailers = await Retailer.countDocuments(filter);
    const totalSalesmen = await Salesman.countDocuments(filter);
    const totalOrders = await Order.countDocuments(filter);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ordersToday = await Order.countDocuments({ ...filter, createdAt: { $gte: today, $lt: tomorrow } });
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const totalSalesThisMonth = await Order.aggregate([
      { $match: { ...filter, createdAt: { $gte: monthStart }, status: { $in: ['confirmed', 'approved', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const lowStockItems = await Inventory.find({ ...filter, stockOnHand: { $lte: 10 } }).limit(5);
    const recentOrders = await Order.find(filter).sort({ createdAt: -1 }).limit(5).populate('retailerId');
    const topSalesmen = await Salesman.find(filter).sort({ 'metrics.totalSales': -1 }).limit(5);

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

const getDashboardWidgets = async (req, res) => {
  try {
    const widgets = [
      { id: 'total_products', title: 'Total Products', type: 'kpi', permission: 'product.view' },
      { id: 'total_retailers', title: 'Total Retailers', type: 'kpi', permission: 'retailer.view' },
      { id: 'total_orders', title: 'Total Orders', type: 'kpi', permission: 'order.view' },
      { id: 'recent_orders', title: 'Recent Orders', type: 'table', permission: 'order.view' },
    ];
    res.json({ success: true, data: widgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getDashboardWidgets };
