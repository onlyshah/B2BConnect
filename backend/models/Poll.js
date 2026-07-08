const { mongoose, tenantFields, schemaOptions } = require('./schemaHelpers');

const pollSchema = new mongoose.Schema({
  ...tenantFields(true),
  type: { type: String, enum: ['poll', 'survey', 'product_voting'], required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  questions: [{
    question: { type: String, required: true },
    inputType: { type: String, enum: ['single', 'multiple', 'text', 'rating'], default: 'single' },
    options: [{ type: String }]
  }],
  status: { type: String, enum: ['draft', 'active', 'closed'], default: 'draft', index: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null }
}, schemaOptions);

pollSchema.index({ companyId: 1, type: 1, status: 1 });

module.exports = mongoose.model('Poll', pollSchema);
