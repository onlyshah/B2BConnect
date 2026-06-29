const bcryptjs = require('bcryptjs');
const RegistrationRequest = require('../models/registration/RegistrationRequest');
const CompanyApplication = require('../models/registration/CompanyApplication');
const DistributorApplication = require('../models/registration/DistributorApplication');
const RetailerApplication = require('../models/registration/RetailerApplication');
const SalesmanApplication = require('../models/registration/SalesmanApplication');

const seedRegistrations = async () => {
  try {
    const existingCount = await RegistrationRequest.countDocuments();
    if (existingCount > 0) {
      console.log('✓ Registration applications already exist');
      return [];
    }

    const created = [];
    const password = 'TempPassword@2026';
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 1. Create Company Application
    const companyReg = await RegistrationRequest.create({
      type: 'company',
      email: 'raj@techinnovations.com',
      phone: '+91-9876543300',
      status: 'pending',
      approvalStatus: 'pending-approval',
      emailVerified: true,
      phoneVerified: true,
    });

    const companyApp = await CompanyApplication.create({
      registrationRequestId: companyReg._id,
      companyName: 'Tech Innovations Ltd',
      businessType: 'manufacturer',
      gstin: '31AABCT9999A1Z5',
      panNumber: 'AAECT9999A',
      ownerName: 'Raj Kumar Verma',
      mobileNumber: '+91-9876543300',
      email: 'raj@techinnovations.com',
      website: 'www.techinnovations.com',
      address: '123 Tech Park, Pune, Maharashtra 411001',
      state: 'Maharashtra',
      city: 'Pune',
      pincode: '411001',
      passwordHash: hashedPassword,
      status: 'pending-approval',
    });
    created.push(companyApp);

    // 2. Create Distributor Application
    const distributorReg = await RegistrationRequest.create({
      type: 'distributor',
      email: 'anish@alphadistribution.com',
      phone: '+91-9876543301',
      status: 'pending',
      approvalStatus: 'pending-approval',
      emailVerified: true,
      phoneVerified: true,
    });

    const distributorApp = await DistributorApplication.create({
      registrationRequestId: distributorReg._id,
      businessName: 'Alpha Distribution Network',
      gstin: '22AABCT5555B1Z0',
      panNumber: 'AAET5555B',
      ownerName: 'Anish Patel',
      mobileNumber: '+91-9876543301',
      email: 'anish@alphadistribution.com',
      state: 'Gujarat',
      city: 'Ahmedabad',
      address: '456 Distribution Hub, Ahmedabad, Gujarat 380001',
      pincode: '380001',
      passwordHash: hashedPassword,
      overallStatus: 'pending-company-approval',
    });
    created.push(distributorApp);

    // 3. Create Retailer Application
    const retailerReg = await RegistrationRequest.create({
      type: 'retailer',
      email: 'vikram@premiumstore.com',
      phone: '+91-9876543302',
      status: 'pending',
      approvalStatus: 'pending-approval',
      emailVerified: true,
      phoneVerified: true,
    });

    const retailerApp = await RetailerApplication.create({
      registrationRequestId: retailerReg._id,
      storeName: 'Premium Retail Store',
      ownerName: 'Vikram Singh',
      mobileNumber: '+91-9876543302',
      email: 'vikram@premiumstore.com',
      address: '789 Retail Lane, Jaipur, Rajasthan 302001',
      state: 'Rajasthan',
      city: 'Jaipur',
      pincode: '302001',
      gstin: '08AABCT3333C1Z5',
      storeCategory: 'super-market',
      passwordHash: hashedPassword,
      geoLocation: {
        type: 'Point',
        coordinates: [75.8267, 26.9124] // [longitude, latitude] for Jaipur
      }
    });
    created.push(retailerApp);

    // 4. Create Salesman Application
    const salesmanReg = await RegistrationRequest.create({
      type: 'salesman',
      email: 'arjun.nair@b2bconnect.in',
      phone: '+91-9876543303',
      status: 'pending',
      approvalStatus: 'pending-approval',
      emailVerified: true,
      phoneVerified: true,
    });

    const salesmanApp = await SalesmanApplication.create({
      registrationRequestId: salesmanReg._id,
      fullName: 'Arjun Kumar Nair',
      email: 'arjun.nair@b2bconnect.in',
      mobileNumber: '+91-9876543303',
      dateOfBirth: new Date('1992-05-15'),
      address: '321 Salesman Plaza, Kochi, Kerala 682001',
      state: 'Kerala',
      city: 'Kochi',
      pincode: '682001',
      experience: 3,
      previousCompany: 'Retail Solutions India',
      aadhaarNumber: '123412341234',
      panNumber: 'ABCDE1234F',
      passwordHash: hashedPassword,
      cv: {
        filename: 'seed-cv.txt',
        url: '/uploads/salesman-applications/seed-cv.txt',
        uploadedAt: new Date()
      }
    });
    created.push(salesmanApp);

    console.log(`✓ Created ${created.length} registration applications`);
    return created;
  } catch (error) {
    console.error('✗ Error seeding registrations:', error.message);
    throw error;
  }
};

module.exports = seedRegistrations;
