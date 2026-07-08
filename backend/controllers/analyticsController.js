const mongoose = require('mongoose');
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
const Campaign = require('../models/Campaign');
const Scheme = require('../models/Scheme');
const { buildVisibilityFilter } = require('../middleware/ownership');

const resolveCompanyId = (req) => req.user?.companyId || req.query?.companyId || req.body?.companyId || req.tenantId;

const buildCompanyFilter = (req, extra = {}) => {
  const companyId = resolveCompanyId(req);
  return {
    companyId,
    isDeleted: false,
    ...extra,
  };
};

const buildEntityFilter = (req, entity, extra = {}) =>
  buildVisibilityFilter(req, req.user?.role || 'super-admin', entity, extra);

const getSummary = async (req, res) => {
  try {
    const { distributorId } = req.query;
    const companyFilter = buildCompanyFilter(req);
    const companyAwareFilter = buildEntityFilter(req, 'retailer', distributorId ? { distributorId } : {});
    const orderFilter = buildEntityFilter(req, 'order', distributorId ? { distributorId } : {});

    const distributorIds = distributorId
      ? [distributorId]
      : (await Distributor.find(companyFilter).select('_id')).map((item) => item._id.toString());

    const distributorOnlyFilter = {
      companyId: companyFilter.companyId,
      isDeleted: false,
      ...(distributorIds.length ? { distributorId: { $in: distributorIds } } : {}),
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
      Distributor.countDocuments({
        ...companyFilter,
        ...(distributorId ? { _id: distributorId } : {}),
      }),
      Retailer.countDocuments({ ...companyAwareFilter, status: 'active' }),
      Retailer.countDocuments({ ...companyAwareFilter, status: 'pending' }),
      Order.countDocuments({ ...orderFilter, status: 'pending' }),
      Order.countDocuments({ ...orderFilter, status: 'delivered' }),
      Invoice.find({ ...distributorOnlyFilter, status: { $in: ['issued', 'overdue'] } }),
      Inventory.find(distributorOnlyFilter),
      Sample.countDocuments({ ...companyAwareFilter, status: 'requested' }),
      ReturnClaim.countDocuments({
        ...companyAwareFilter,
        status: { $in: ['submitted', 'under-review'] },
      }),
      Review.find(companyFilter).select('rating'),
      Story.countDocuments({ ...companyFilter, status: 'published' }),
      Campaign.countDocuments({ ...companyFilter, status: 'active' }),
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

const getSalesPerformance = async (req, res) => {
  try {
    const { distributorId, startDate, endDate } = req.query;
    const filter = buildEntityFilter(req, 'order', distributorId ? { distributorId } : {});

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

const getInventoryPerformance = async (req, res) => {
  try {
    const { distributorId } = req.query;
    const filter = buildCompanyFilter(req, distributorId ? { distributorId } : {});

    const inventory = await Inventory.find(filter).populate('productId');
    const lowStockItems = inventory.filter(
      (item) => item.reorderLevel !== undefined && item.stockOnHand <= item.reorderLevel
    );

    const totalValue = inventory.reduce(
      (sum, item) => sum + item.stockOnHand * (item.productId?.mrp || 0),
      0
    );

    res.json({
      success: true,
      data: {
        totalItems: inventory.length,
        lowStockItems: lowStockItems.length,
        totalInventoryValue: Math.round(totalValue * 100) / 100,
        topItems: inventory.sort((a, b) => b.stockOnHand - a.stockOnHand).slice(0, 10),
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
