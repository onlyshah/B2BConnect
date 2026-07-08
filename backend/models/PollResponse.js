const { mongoose, schemaOptions } = require('./schemaHelpers');

const pollResponseSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true, index: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  answers: [{ type: mongoose.Schema.Types.Mixed }],
  submittedAt: { type: Date, default: Date.now, index: true }
}, schemaOptions);

pollResponseSchema.index({ pollId: 1, retailerId: 1 }, { unique: true });

module.exports = mongoose.model('PollResponse', pollResponseSchema);
