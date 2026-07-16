function resolveCompanyId(req) {
  return req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;
}

function buildTenantFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

function getPagination(req, defaultLimit = 10) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || defaultLimit;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

module.exports = {
  resolveCompanyId,
  buildTenantFilter,
  getPagination,
};
