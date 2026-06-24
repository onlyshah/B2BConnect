const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Retailer = require('../models/Retailer');
const { ensureTenant } = require('../middleware/auth');

// Import registration routes
const registrationRoutes = require('./auth/registration');

const router = express.Router();

// Include registration routes
router.use('/', registrationRoutes);

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, tenantId: user.tenantId, role: user.role, tokenVersion: user.refreshTokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, tenantId: user.tenantId, role: user.role, tokenVersion: user.refreshTokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (user.status !== 'active') {
    return res.status(403).json({ message: `Account is ${user.status}` });
  }

  const { accessToken, refreshToken } = generateTokens(user);
  res.json({
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId }
  });
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
    await User.findOneAndUpdate(
      { _id: decoded.userId, tenantId: decoded.tenantId },
      { $inc: { refreshTokenVersion: 1 }, updatedAt: new Date() }
    );
  } catch (err) {
    // Logout should be idempotent from the client perspective.
  }

  res.json({ message: 'Logged out' });
});

module.exports = router;
