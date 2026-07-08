const mongoose = require('mongoose');

function tenantFields(required = true) {
  return {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  };
}

const schemaOptions = {
  timestamps: true,
  versionKey: '__v'
};

module.exports = {
  mongoose,
  tenantFields,
  schemaOptions
};
