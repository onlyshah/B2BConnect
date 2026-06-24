const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const ensureTenant = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId;
  if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

  req.user = req.user || {};
  req.user.tenantId = tenantId;
  req.tenantId = tenantId;
  next();
};

module.exports = { authenticate, authorize, ensureTenant };
