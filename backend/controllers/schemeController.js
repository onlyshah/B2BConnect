const Scheme = require('../models/Scheme');
const resolveCompanyId = (req) => req.user?.companyId || req.body?.companyId || req.query?.companyId || req.tenantId;

function buildSchemeFilter(req, extra = {}) {
  return {
    tenantId: req.tenantId,
    companyId: resolveCompanyId(req),
    isDeleted: false,
    ...extra,
  };
}

const getSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find(buildSchemeFilter(req)).sort({ createdAt: -1 });
    res.json({ success: true, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createScheme = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const scheme = new Scheme({ ...req.body, tenantId: req.tenantId, companyId: resolveCompanyId(req) });
    await scheme.save();
    res.status(201).json({ success: true, data: scheme, message: 'Scheme created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findOneAndUpdate({ _id: req.params.schemeId, ...buildSchemeFilter(req) }, req.body, { new: true });
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, data: scheme, message: 'Scheme updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findOneAndUpdate(
      { _id: req.params.schemeId, ...buildSchemeFilter(req) },
      { isDeleted: true, deletedAt: new Date(), status: 'archived' },
      { new: true }
    );
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, message: 'Scheme deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSchemes, createScheme, updateScheme, deleteScheme };
