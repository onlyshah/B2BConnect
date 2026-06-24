const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  recipientType: { type: String, enum: ['user', 'distributor', 'retailer', 'company'] },
  recipientId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'sample', 'payment', 'launch', 'scheme', 'alert'] },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  payload: Object,
  readAt: Date,
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ tenantId: 1, recipientId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
