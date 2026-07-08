const { mongoose, schemaOptions } = require('./schemaHelpers');

const storyViewSchema = new mongoose.Schema({
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true, index: true },
  viewedAt: { type: Date, default: Date.now, index: true }
}, schemaOptions);

storyViewSchema.index({ storyId: 1, retailerId: 1 }, { unique: true });

module.exports = mongoose.model('StoryView', storyViewSchema);
