const mongoose = require('mongoose');

const salesmanSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  distributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Distributor' }],
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  joiningDate: { type: Date, default: Date.now },
  
  territories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Territory' }],
  assignedRetailers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Retailer' }],
  
  dailyVisitTarget: { type: Number, default: 20 },
  monthlyOrderTarget: { type: Number, default: 40 },
  totalVisits: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  retailersAdded: { type: Number, default: 0 },
  performanceScore: { type: Number, default: 0, min: 0, max: 100 },
  
  status: { type: String, enum: ['active', 'inactive', 'on-leave', 'terminated'], default: 'active' },
  verificationStatus: { type: String, enum: ['unverified', 'verified', 'approved'], default: 'unverified' },
  
  baseSalary: { type: Number },
  incentiveStructure: {
    salesRevenue: { target: Number, rate: Number },
    retailersAdded: { target: Number, rate: Number },
    orderCompliance: { target: Number, rate: Number }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActive: { type: Date }
}, { timestamps: true });

salesmanSchema.index({ tenantId: 1, email: 1 });
salesmanSchema.index({ tenantId: 1, territories: 1 });
salesmanSchema.index({ tenantId: 1, status: 1 });

module.exports = mongoose.model('Salesman', salesmanSchema);
