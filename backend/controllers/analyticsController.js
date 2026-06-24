const Product = require('../models/Product');
const Distributor = require('../models/Distributor');
const Retailer = require('../models/Retailer');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Inventory = require('../models/Inventory');
const Sample = require('../models/Sample');
const ReturnClaim = require('../models/Return');
const Review = require('../models/Review');
const Story = require('../models/Story');
const Advertisement = require('../models/Advertisement');
const Scheme = require('../models/Scheme');
const { buildVisibilityFilter } = require('../middleware/ownership');

// Get analytics summary
const getSummary = async (req, res) => {
  try {
    const { companyId, distributorId } = req.query;
    const tenantFilter = { tenantId: req.tenantId };
    const roleFilter = buildVisibilityFilter(req, req.user?.role || 'super-admin', 'retailer');
    const companyFilter = companyId ? { ...tenantFilter, companyId } : tenantFilter;
    const companyAwareFilter = {
      ...roleFilter,
      ...(companyId ? { companyId } : {}),
      ...(distributorId ? { distributorId } : {}),
    };

    const distributorEntityFilter = {
      ...companyFilter,
      ...(distributorId ? { _id: distributorId } : {}),
    };

    const distributorIds = distributorId
      ? [distributorId]
      : (await Distributor.find(companyFilter).select('_id')).map((item) =>
          item._id.toString()
        );

    const distributorOnlyFilter = {
      ...tenantFilter,
      ...((companyId || distributorId) ? { distributorId: { $in: distributorIds } } : {}),
    };

    const [
      productCount,
      distributorCount,
      activeRetailerCount,
      pendingRetailerCount,
      pendingOrderCount,
      deliveredOrderCount,
      openInvoiceRows,
      lowStockRows,
      pendingSamples,
      openReturns,
      reviewRows,
      publishedStoryCount,
      activeCampaignCount,
      activeSchemeCount,
    ] = await Promise.all([
      Product.countDocuments(companyFilter),
      Distributor.countDocuments(distributorEntityFilter),
      Retailer.countDocuments({ ...companyAwareFilter, status: 'active' }),
      Retailer.countDocuments({ ...companyAwareFilter, status: 'pending' }),
      Order.countDocuments({ ...companyAwareFilter, status: 'pending' }),
      Order.countDocuments({ ...companyAwareFilter, status: 'delivered' }),
      Invoice.find({ ...distributorOnlyFilter, status: { $in: ['issued', 'overdue'] } }),
      Inventory.find(distributorOnlyFilter),
      Sample.countDocuments({ ...companyAwareFilter, status: 'requested' }),
      ReturnClaim.countDocuments({
        ...companyAwareFilter,
        status: { $in: ['submitted', 'under-review'] },
      }),
      Review.find(tenantFilter).select('rating'),
      Story.countDocuments({ ...companyFilter, status: 'published' }),
      Advertisement.countDocuments({ ...companyFilter, status: 'active' }),
      Scheme.countDocuments({ ...companyFilter, status: 'active' }),
    ]);

    const outstandingAmount = openInvoiceRows.reduce((sum, invoice) => {
      return sum + Math.max((invoice.amountDue || 0) - (invoice.amountPaid || 0), 0);
    }, 0);

    const lowStockCount = lowStockRows.filter((item) => {
      return item.reorderLevel !== undefined && item.stockOnHand <= item.reorderLevel;
    }).length;

    const averageRating =
      reviewRows.length
        ? reviewRows.reduce((sum, review) => sum + review.rating, 0) / reviewRows.length
        : 0;

    res.json({
      success: true,
      data: {
        products: productCount,
        distributors: distributorCount,
        retailers: {
          active: activeRetailerCount,
          pendingApproval: pendingRetailerCount,
        },
        orders: {
          pending: pendingOrderCount,
          delivered: deliveredOrderCount,
        },
        finance: {
          openInvoices: openInvoiceRows.length,
          outstandingAmount,
        },
        inventory: {
          lowStock: lowStockCount,
        },
        workflows: {
          pendingSamples,
          openReturns,
        },
        discovery: {
          publishedStories: publishedStoryCount,
          averageRating: Math.round(averageRating * 100) / 100,
        },
        campaigns: {
          active: activeCampaignCount,
        },
        schemes: {
          active: activeSchemeCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sales performance
const getSalesPerformance = async (req, res) => {
  try {
    const { companyId, distributorId, startDate, endDate } = req.query;

    const filter = buildVisibilityFilter(req, req.user?.role || 'super-admin', 'order');
    if (companyId) filter.companyId = companyId;
    if (distributorId) filter.distributorId = distributorId;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate('distributorId', 'name')
      .populate('retailerId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgOrderValue = orders.length ? totalSales / orders.length : 0;

    res.json({
      success: true,
      data: {
        totalOrders: orders.length,
        totalSales,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        orders: orders.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get inventory performance
const getInventoryPerformance = async (req, res) => {
  try {
    const { distributorId } = req.query;

    const filter = { tenantId: req.tenantId };
    if (distributorId) filter.distributorId = distributorId;

    const inventory = await Inventory.find(filter).populate('productId');

    const lowStockItems = inventory.filter(
      (item) =>
        item.reorderLevel !== undefined && item.stockOnHand <= item.reorderLevel
    );

    const totalValue = inventory.reduce(
      (sum, item) => sum + (item.stockOnHand * (item.productId?.mrp || 0)),
      0
    );

    res.json({
      success: true,
      data: {
        totalItems: inventory.length,
        lowStockItems: lowStockItems.length,
        totalInventoryValue: Math.round(totalValue * 100) / 100,
        topItems: inventory
          .sort((a, b) => b.stockOnHand - a.stockOnHand)
          .slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSummary,
  getSalesPerformance,
  getInventoryPerformance,
};
