const Territory = require('../models/Territory');

const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

const buildTerritoryFilter = (req, extra = {}) => ({
  companyId: resolveCompanyId(req),
  isDeleted: false,
  ...extra,
});

const getTerritories = async (req, res) => {
  try {
    const territories = await Territory.find(buildTerritoryFilter(req)).sort({
      'location.state': 1,
      'location.city': 1,
    });

    res.json({
      success: true,
      data: territories,
      message: 'Territories loaded',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTerritory = async (req, res) => {
  try {
    const { country, state, city, regions, assignedDistributorId, coverageRules, status } = req.body;
    const normalizedRegions = Array.isArray(regions) ? regions : regions ? [regions] : [];
    const companyId = resolveCompanyId(req);

    if (!country || !state || !city || !normalizedRegions.length) {
      return res.status(400).json({
        success: false,
        message: 'Country, state, city, and at least one area are required',
      });
    }

    const territory = await Territory.create({
      companyId,
      name: `${state} - ${city}`,
      location: {
        country,
        state,
        city,
        regions: normalizedRegions,
      },
      assignedDistributorId: assignedDistributorId || null,
      coverageRules: coverageRules || {},
      status: status || 'active',
    });

    res.status(201).json({ success: true, data: territory, message: 'Territory created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTerritory = async (req, res) => {
  try {
    const { country, state, city, regions, assignedDistributorId, coverageRules, status } = req.body;
    const territoryId = req.params.id;
    const data = {};

    if (country || state || city || regions) {
      data.location = {};
      if (country) data.location.country = country;
      if (state) data.location.state = state;
      if (city !== undefined) data.location.city = city;
      if (regions !== undefined) data.location.regions = Array.isArray(regions) ? regions : regions ? [regions] : [];
    }
    if (assignedDistributorId !== undefined) data.assignedDistributorId = assignedDistributorId;
    if (coverageRules !== undefined) data.coverageRules = coverageRules;
    if (status) data.status = status;
    if (data.location && (state || city)) {
      const nameParts = [];
      if (state) nameParts.push(state);
      if (city) nameParts.push(city);
      data.name = nameParts.join(' - ');
    }
    data.updatedAt = new Date();

    const territory = await Territory.findOneAndUpdate(
      { _id: territoryId, ...buildTerritoryFilter(req) },
      data,
      { new: true }
    );

    if (!territory) {
      return res.status(404).json({ success: false, message: 'Territory not found' });
    }

    res.json({ success: true, data: territory, message: 'Territory updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTerritory = async (req, res) => {
  try {
    const territory = await Territory.findOneAndUpdate(
      { _id: req.params.id, ...buildTerritoryFilter(req) },
      { isDeleted: true, deletedAt: new Date(), status: 'inactive' },
      { new: true }
    );

    if (!territory) {
      return res.status(404).json({ success: false, message: 'Territory not found' });
    }

    res.json({ success: true, data: territory, message: 'Territory deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTerritories,
  createTerritory,
  updateTerritory,
  deleteTerritory,
};
