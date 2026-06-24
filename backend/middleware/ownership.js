const buildVisibilityFilter = (req, role, entity = null) => {
  const tenantFilter = { tenantId: req.user?.tenantId || req.tenantId };

  if (!req.user) return tenantFilter;

  switch (role) {
    case 'super-admin':
      return tenantFilter;
    case 'company-admin':
      return {
        ...tenantFilter,
        ...(entity === 'distributor' ? { companyId: req.user.companyId } : {}),
        ...(entity === 'salesman' ? { company: req.user.companyId } : {}),
        ...(entity === 'retailer' ? { companyId: req.user.companyId } : {}),
      };
    case 'distributor-admin':
      return {
        ...tenantFilter,
        ...(entity === 'retailer' ? { distributorId: req.user.distributorId } : {}),
        ...(entity === 'salesman' ? { distributors: req.user.distributorId } : {}),
        ...(entity === 'order' ? { distributorId: req.user.distributorId } : {}),
        ...(entity === 'inventory' ? { distributorId: req.user.distributorId } : {}),
      };
    case 'salesman':
      return {
        ...tenantFilter,
        ...(entity === 'retailer' ? { _id: { $in: [] } } : {}),
        ...(entity === 'order' ? { salesmanId: req.user.salesmanId } : {}),
        ...(entity === 'visit' ? { salesmanId: req.user.salesmanId } : {}),
      };
    case 'retailer':
      return {
        ...tenantFilter,
        ...(entity === 'order' ? { retailerId: req.user.retailerId } : {}),
        ...(entity === 'sample' ? { retailerId: req.user.retailerId } : {}),
        ...(entity === 'demo' ? { retailerId: req.user.retailerId } : {}),
      };
    default:
      return tenantFilter;
  }
};

const getRoleContext = (req) => {
  const role = req.user?.role;
  return {
    role,
    tenantId: req.user?.tenantId || req.tenantId,
    companyId: req.user?.companyId,
    distributorId: req.user?.distributorId,
    salesmanId: req.user?.salesmanId,
    retailerId: req.user?.retailerId,
  };
};

module.exports = { buildVisibilityFilter, getRoleContext };
