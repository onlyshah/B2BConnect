const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  salesman: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true, index: true },
  
  attendanceDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ['present', 'absent', 'on-leave', 'half-day'], default: 'absent' },
  
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  
  checkInLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  
  checkOutLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  
  workingHours: { type: Number },
  plannedVisits: { type: Number, default: 0 },
  completedVisits: { type: Number, default: 0 },
  ordersGenerated: { type: Number, default: 0 },
  collectionsRecorded: { type: Number, default: 0 },
  
  notes: String,
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvalNotes: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

attendanceSchema.index({ tenantId: 1, salesman: 1, attendanceDate: -1 });
attendanceSchema.index({ tenantId: 1, status: 1, attendanceDate: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
