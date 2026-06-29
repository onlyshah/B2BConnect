const Attendance = require('../models/Attendance');
const Salesman = require('../models/Salesman');

// Check in
const checkIn = async (req, res) => {
  try {
    const { salesmanId } = req.params;
    const { location } = req.body;

    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return res.status(400).json({ success: false, message: 'Live location is required for check-in' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      salesman: salesmanId,
      attendanceDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      tenantId: req.tenantId
    });

    if (!attendance) {
      attendance = new Attendance({
        tenantId: req.tenantId,
        salesman: salesmanId,
        attendanceDate: new Date(),
        status: 'present'
      });
    }

    attendance.checkInTime = new Date();
    attendance.checkInLocation = {
      type: 'Point',
      coordinates: [location.longitude, location.latitude]
    };
    attendance.status = 'present';

    await attendance.save();

    res.json({
      success: true,
      data: attendance,
      message: 'Check-in recorded'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check out
const checkOut = async (req, res) => {
  try {
    const { salesmanId } = req.params;
    const { location } = req.body;

    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return res.status(400).json({ success: false, message: 'Live location is required for check-out' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      salesman: salesmanId,
      attendanceDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      tenantId: req.tenantId,
      checkInTime: { $exists: true }
    });

    if (!attendance) {
      return res.status(400).json({ success: false, message: 'No check-in found for today' });
    }

    attendance.checkOutTime = new Date();
    attendance.checkOutLocation = {
      type: 'Point',
      coordinates: [location.longitude, location.latitude]
    };

    if (attendance.checkInTime && attendance.checkOutTime) {
      const hours = (attendance.checkOutTime - attendance.checkInTime) / (1000 * 60 * 60);
      attendance.workingHours = Math.round(hours * 100) / 100;
    }

    await attendance.save();

    res.json({
      success: true,
      data: attendance,
      message: 'Check-out recorded'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get today attendance
const getTodayAttendance = async (req, res) => {
  try {
    const { salesmanId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      salesman: salesmanId,
      attendanceDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      tenantId: req.tenantId
    });

    res.json({
      success: true,
      data: attendance || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance history
const getAttendanceHistory = async (req, res) => {
  try {
    const { salesmanId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const attendance = await Attendance.find({
      salesman: salesmanId,
      tenantId: req.tenantId
    })
      .skip(skip)
      .limit(limit)
      .sort({ attendanceDate: -1 })
      .populate('salesman', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName email');

    const total = await Attendance.countDocuments({
      salesman: salesmanId,
      tenantId: req.tenantId
    });

    res.json({
      success: true,
      data: attendance,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory
};
