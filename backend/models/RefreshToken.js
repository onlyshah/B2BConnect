const { mongoose, schemaOptions } = require('./schemaHelpers');

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true },
  deviceId: { type: String, default: '' },
  expiresAt: { type: Date, required: true, index: true },
  revoked: { type: Boolean, default: false, index: true }
}, schemaOptions);

refreshTokenSchema.index({ userId: 1, deviceId: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
