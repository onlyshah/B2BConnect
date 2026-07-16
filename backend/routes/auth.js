const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Retailer = require('../models/Retailer');
const Attendance = require('../models/Attendance');
const { authenticate, ensureTenant } = require('../middleware/auth');

// Import registration routes
const registrationRoutes = require('./auth/registration');

const router = express.Router();

// Include registration routes
router.use('/', registrationRoutes);

const generateTokens = (user) => {
  // Include identifying fields in token so middleware can populate req.user.companyId etc.
  const payload = {
    userId: user._id,
    tenantId: user.tenantId,
    role: user.role,
    tokenVersion: user.refreshTokenVersion,
    companyId: user.companyId,
    distributorId: user.distributorId,
    retailerId: user.retailerId,
    salesmanId: user.salesmanId,
    email: user.email
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

  return { accessToken, refreshToken };
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        companyId: user.companyId,
        distributorId: user.distributorId,
        retailerId: user.retailerId,
        salesmanId: user.salesmanId
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Authentication failed' });
  }
});

router.get('/me', authenticate, ensureTenant, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.auth.userId, tenantId: req.tenantId }).select('-passwordHash -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        companyId: user.companyId,
        distributorId: user.distributorId,
        retailerId: user.retailerId,
        salesmanId: user.salesmanId,
        permissions: user.permissions || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/register-retailer', ensureTenant, async (req, res) => {
  const { name, email, phone, password, storeName, companyId, distributorId, gstin, location, category } = req.body;
  if (!name || !email || !phone || !password || !storeName || !companyId || !distributorId) {
    return res.status(400).json({
      message: 'name, email, phone, password, storeName, companyId, and distributorId are required'
    });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'User already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const retailer = new Retailer({
    tenantId: req.tenantId,
    companyId,
    distributorId,
    name,
    storeName,
    gstin,
    location,
    category: category || 'silver',
    status: 'pending'
  });
  await retailer.save();

  const user = new User({
    tenantId: req.tenantId,
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
    role: 'retailer',
    companyId,
    distributorId,
    retailerId: retailer._id.toString(),
    status: 'pending'
  });

  await user.save();
  res.status(201).json({ message: 'Registration successful, awaiting approval', retailerId: retailer._id });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ _id: decoded.userId, tenantId: decoded.tenantId });
    if (!user || user.status !== 'active' || decoded.tokenVersion !== user.refreshTokenVersion) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    res.json(generateTokens(user));
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.json({ message: 'Logged out' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ _id: decoded.userId, tenantId: decoded.tenantId });
    if (!user || decoded.tokenVersion !== user.refreshTokenVersion) {
      return res.json({ message: 'Logged out' });
    }

    if (user.role === 'salesman' && user.salesmanId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const activeAttendance = await Attendance.findOne({
        salesman: user.salesmanId,
        tenantId: user.tenantId,
        attendanceDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        checkInTime: { $exists: true },
        checkOutTime: { $exists: false }
      });
      if (activeAttendance) {
        return res.status(400).json({ message: 'Cannot logout while attendance is active. Please check out first.' });
      }
    }

    await User.findOneAndUpdate(
      { _id: user._id, tenantId: user.tenantId },
      { $inc: { refreshTokenVersion: 1 }, updatedAt: new Date() }
    );
  } catch (err) {
    return res.json({ message: 'Logged out' });
  }

  res.json({ message: 'Logged out' });
});

module.exports = router;
