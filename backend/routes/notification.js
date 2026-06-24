const express = require('express');
const { authenticate, ensureTenant } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getNotifications);

router.patch('/:notificationId/read', authenticate, ensureTenant, markAsRead);

router.post('/mark-all-read', authenticate, ensureTenant, markAllAsRead);

module.exports = router;
