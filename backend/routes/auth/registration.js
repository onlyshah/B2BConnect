const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const RegistrationRequest = require('../../models/registration/RegistrationRequest');
const CompanyApplication = require('../../models/registration/CompanyApplication');
const DistributorApplication = require('../../models/registration/DistributorApplication');
const SalesmanApplication = require('../../models/registration/SalesmanApplication');
const RetailerApplication = require('../../models/registration/RetailerApplication');
const Company = require('../../models/Company');
const Distributor = require('../../models/Distributor');

// Email validation helper
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Phone validation helper
const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
};

// Password validation helper
const validatePassword = (password) => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password);
};

// GSTIN validation helper
const validateGSTIN = (gstin) => {
  return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[Z]{1}[A-Z0-9]{1}$/.test(gstin);
};

// PAN validation helper
const validatePAN = (pan) => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

/**
 * @route   POST /api/auth/register/company
 * @desc    Register new company
 * @access  Public
 */
router.post('/register/company', async (req, res) => {
  try {
    const { 
      companyName, businessType, gstin, panNumber, ownerName, 
      mobileNumber, email, website, address, state, city, 
      pincode, password, confirmPassword 
    } = req.body;

    // Validation
    if (!companyName || !businessType || !gstin || !panNumber || !ownerName || 
        !mobileNumber || !email || !address || !state || !city || !pincode || 
        !password || !confirmPassword) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePhone(mobileNumber)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase, number and special character' });
    }

    if (!validateGSTIN(gstin)) {
      return res.status(400).json({ error: 'Invalid GSTIN format' });
    }

    if (!validatePAN(panNumber)) {
      return res.status(400).json({ error: 'Invalid PAN format' });
    }

    // Check if email already exists
    const existingRequest = await RegistrationRequest.findOne({ email: email.toLowerCase() });
    if (existingRequest) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingApp = await CompanyApplication.findOne({ email: email.toLowerCase() });
    if (existingApp) {
      return res.status(400).json({ error: 'Email already used for company registration' });
    }

    // Create registration request
    const regRequest = new RegistrationRequest({
      type: 'company',
      email: email.toLowerCase(),
      phone: mobileNumber,
      status: 'pending'
    });
    await regRequest.save();

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create company application
    const companyApp = new CompanyApplication({
      registrationRequestId: regRequest._id,
      companyName,
      businessType,
      gstin,
      panNumber,
      ownerName,
      mobileNumber,
      email: email.toLowerCase(),
      website,
      address,
      state,
      city,
      pincode,
      passwordHash,
      status: 'pending-approval'
    });

    await companyApp.save();

    res.status(201).json({
      message: 'Company registration submitted successfully',
      applicationId: companyApp._id,
      status: 'pending-approval',
      note: 'Your application is pending Super Admin approval'
    });
  } catch (error) {
    console.error('Company registration error:', error);
    res.status(500).json({ error: 'Server error during company registration' });
  }
});

/**
 * @route   POST /api/auth/register/distributor
 * @desc    Register new distributor
 * @access  Public
 */
router.post('/register/distributor', async (req, res) => {
  try {
    const {
      businessName, gstin, panNumber, ownerName, mobileNumber, email,
      address, state, city, pincode, warehouseCapacity, password,
      confirmPassword, companyIds = []
    } = req.body;

    // Validation
    if (!businessName || !gstin || !panNumber || !ownerName || !mobileNumber ||
        !email || !address || !state || !city || !pincode || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePhone(mobileNumber)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase, number and special character' });
    }

    if (!validateGSTIN(gstin)) {
      return res.status(400).json({ error: 'Invalid GSTIN format' });
    }

    if (!validatePAN(panNumber)) {
      return res.status(400).json({ error: 'Invalid PAN format' });
    }

    // Check if email already exists
    const existingRequest = await RegistrationRequest.findOne({ email: email.toLowerCase() });
    if (existingRequest) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingApp = await DistributorApplication.findOne({ email: email.toLowerCase() });
    if (existingApp) {
      return res.status(400).json({ error: 'Email already used for distributor registration' });
    }

    // Create registration request
    const regRequest = new RegistrationRequest({
      type: 'distributor',
      email: email.toLowerCase(),
      phone: mobileNumber,
      status: 'pending'
    });
    await regRequest.save();

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Prepare applied companies
    const appliedCompanies = [];
    if (companyIds && companyIds.length > 0) {
      for (const companyId of companyIds) {
        const company = await Company.findById(companyId);
        if (company) {
          appliedCompanies.push({
            companyId: company._id,
            companyName: company.name,
            status: 'pending'
          });
        }
      }
    }

    // Create distributor application
    const distributorApp = new DistributorApplication({
      registrationRequestId: regRequest._id,
      businessName,
      gstin,
      panNumber,
      ownerName,
      mobileNumber,
      email: email.toLowerCase(),
      address,
      state,
      city,
      pincode,
      warehouseCapacity,
      passwordHash,
      appliedCompanies,
      overallStatus: 'pending-company-approval'
    });

    await distributorApp.save();

    res.status(201).json({
      message: 'Distributor registration submitted successfully',
      applicationId: distributorApp._id,
      status: 'pending-company-approval',
      appliedCompanies: appliedCompanies.map(c => ({ id: c.companyId, name: c.companyName })),
      note: 'Your applications are pending company approval'
    });
  } catch (error) {
    console.error('Distributor registration error:', error);
    res.status(500).json({ error: 'Server error during distributor registration' });
  }
});

/**
 * @route   POST /api/auth/register/salesman
 * @desc    Register new salesman
 * @access  Public
 */
router.post('/register/salesman', async (req, res) => {
  try {
    const {
      fullName, mobileNumber, email, dateOfBirth, address, state,
      city, pincode, experience, previousCompany, password,
      confirmPassword, companyIds = []
    } = req.body;

    // Validation
    if (!fullName || !mobileNumber || !email || !dateOfBirth ||
        !address || !state || !city || !pincode || experience === undefined ||
        !password || !confirmPassword) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePhone(mobileNumber)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase, number and special character' });
    }

    if (experience < 0 || experience > 60) {
      return res.status(400).json({ error: 'Experience must be between 0 and 60 years' });
    }

    // Check if email already exists
    const existingRequest = await RegistrationRequest.findOne({ email: email.toLowerCase() });
    if (existingRequest) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingApp = await SalesmanApplication.findOne({ email: email.toLowerCase() });
    if (existingApp) {
      return res.status(400).json({ error: 'Email already used for salesman registration' });
    }

    // Create registration request
    const regRequest = new RegistrationRequest({
      type: 'salesman',
      email: email.toLowerCase(),
      phone: mobileNumber,
      status: 'pending'
    });
    await regRequest.save();

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Prepare applied companies
    const appliedCompanies = [];
    if (companyIds && companyIds.length > 0) {
      for (const companyId of companyIds) {
        const company = await Company.findById(companyId);
        if (company) {
          appliedCompanies.push({
            companyId: company._id,
            companyName: company.name,
            status: 'pending'
          });
        }
      }
    }

    // Create salesman application
    const salesmanApp = new SalesmanApplication({
      registrationRequestId: regRequest._id,
      fullName,
      mobileNumber,
      email: email.toLowerCase(),
      dateOfBirth: new Date(dateOfBirth),
      address,
      state,
      city,
      pincode,
      experience: parseInt(experience),
      previousCompany,
      passwordHash,
      appliedCompanies,
      overallStatus: 'pending-company-approval'
    });

    await salesmanApp.save();

    res.status(201).json({
      message: 'Salesman registration submitted successfully',
      applicationId: salesmanApp._id,
      status: 'pending-company-approval',
      appliedCompanies: appliedCompanies.map(c => ({ id: c.companyId, name: c.companyName })),
      note: 'Your applications are pending company approval'
    });
  } catch (error) {
    console.error('Salesman registration error:', error);
    res.status(500).json({ error: 'Server error during salesman registration' });
  }
});

/**
 * @route   POST /api/auth/register/retailer
 * @desc    Register new retailer
 * @access  Public
 */
router.post('/register/retailer', async (req, res) => {
  try {
    const {
      storeName, ownerName, mobileNumber, email, gstin, address,
      state, city, pincode, storeCategory, password, confirmPassword,
      latitude, longitude, distributorId
    } = req.body;

    // Validation
    if (!storeName || !ownerName || !mobileNumber || !email ||
        !address || !state || !city || !pincode || !storeCategory ||
        !password || !confirmPassword || latitude === undefined || 
        longitude === undefined) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePhone(mobileNumber)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase, number and special character' });
    }

    // Check if email already exists
    const existingRequest = await RegistrationRequest.findOne({ email: email.toLowerCase() });
    if (existingRequest) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingApp = await RetailerApplication.findOne({ email: email.toLowerCase() });
    if (existingApp) {
      return res.status(400).json({ error: 'Email already used for retailer registration' });
    }

    // Verify distributor exists if provided
    let selectedDistributor = null;
    if (distributorId) {
      selectedDistributor = await Distributor.findById(distributorId);
      if (!selectedDistributor) {
        return res.status(400).json({ error: 'Selected distributor not found' });
      }
    }

    // Create registration request
    const regRequest = new RegistrationRequest({
      type: 'retailer',
      email: email.toLowerCase(),
      phone: mobileNumber,
      status: 'pending'
    });
    await regRequest.save();

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create retailer application
    const retailerApp = new RetailerApplication({
      registrationRequestId: regRequest._id,
      storeName,
      ownerName,
      mobileNumber,
      email: email.toLowerCase(),
      gstin,
      address,
      state,
      city,
      pincode,
      storeCategory,
      passwordHash,
      selectedDistributorId: selectedDistributor?._id,
      selectedDistributorName: selectedDistributor?.name,
      geoLocation: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      status: selectedDistributor ? 'pending-distributor-approval' : 'pending-distributor-approval'
    });

    await retailerApp.save();

    res.status(201).json({
      message: 'Retailer registration submitted successfully',
      applicationId: retailerApp._id,
      status: 'pending-distributor-approval',
      selectedDistributor: selectedDistributor ? {
        id: selectedDistributor._id,
        name: selectedDistributor.name
      } : null,
      note: 'Your application is pending distributor approval'
    });
  } catch (error) {
    console.error('Retailer registration error:', error);
    res.status(500).json({ error: 'Server error during retailer registration' });
  }
});

/**
 * @route   GET /api/auth/companies/search
 * @desc    Search companies for distributor/salesman registration
 * @access  Public
 */
router.get('/companies/search', async (req, res) => {
  try {
    const { query, state, city, page = 1, limit = 10 } = req.query;

    let filters = {};
    if (query) {
      filters.$or = [
        { name: { $regex: query, $options: 'i' } },
        { industry: { $regex: query, $options: 'i' } }
      ];
    }

    if (state) filters.state = state;
    if (city) filters.city = city;

    filters.status = 'active';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const companies = await Company.find(filters)
      .select('_id name industry city state logo')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Company.countDocuments(filters);

    res.json({
      companies,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Company search error:', error);
    res.status(500).json({ error: 'Server error during company search' });
  }
});

/**
 * @route   GET /api/auth/distributors/search
 * @desc    Find nearby distributors for retailer registration
 * @access  Public
 */
router.get('/distributors/search', async (req, res) => {
  try {
    const { latitude, longitude, state, city, pincode, maxDistance = 50000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    let filters = { status: 'active' };

    if (state) filters.state = state;
    if (city) filters.city = city;

    // Find nearby distributors using geospatial query
    const distributors = await Distributor.find({
      ...filters,
      geoLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
    .select('_id name city state territory geoLocation')
    .limit(20)
    .lean();

    res.json({
      distributors: distributors.map(d => ({
        id: d._id,
        name: d.name,
        city: d.city,
        state: d.state,
        territory: d.territory
      }))
    });
  } catch (error) {
    console.error('Distributor search error:', error);
    res.status(500).json({ error: 'Server error during distributor search' });
  }
});

/**
 * @route   GET /api/auth/registration-status/:applicationId
 * @desc    Get registration status
 * @access  Public
 */
router.get('/registration-status/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Try to find in any application collection
    let application = await CompanyApplication.findById(applicationId);
    if (!application) {
      application = await DistributorApplication.findById(applicationId);
    }
    if (!application) {
      application = await SalesmanApplication.findById(applicationId);
    }
    if (!application) {
      application = await RetailerApplication.findById(applicationId);
    }

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const type = application.__typename || application.constructor.modelName;
    const status = application.status || application.overallStatus;

    res.json({
      applicationId: application._id,
      type: type.toLowerCase().replace('application', ''),
      status,
      email: application.email,
      name: application.companyName || application.businessName || application.fullName || application.storeName,
      createdAt: application.createdAt,
      approvalHistory: application.approvalHistory || []
    });
  } catch (error) {
    console.error('Get registration status error:', error);
    res.status(500).json({ error: 'Server error fetching registration status' });
  }
});

module.exports = router;
