const express = require('express');
const router = express.Router();
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory
} = require('../controllers/attendanceController');

router.post('/:salesmanId/check-in', authenticate, ensureTenant, authorize(['salesman', 'company-admin', 'distributor-admin']), checkIn);
router.post('/:salesmanId/check-out', authenticate, ensureTenant, authorize(['salesman', 'company-admin', 'distributor-admin']), checkOut);
router.get('/:salesmanId/today', authenticate, ensureTenant, authorize(['salesman', 'company-admin', 'distributor-admin']), getTodayAttendance);
router.get('/:salesmanId/history', authenticate, ensureTenant, authorize(['salesman', 'company-admin', 'distributor-admin']), getAttendanceHistory);

module.exports = router;
