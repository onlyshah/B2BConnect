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

function normalizeTenantAlias(schema) {
  schema.pre('validate', function normalizeTenantAliasHook(next) {
    if (!this.companyId && this.tenantId) {
      this.companyId = this.tenantId;
    }

    if (!this.tenantId && this.companyId) {
      this.tenantId = this.companyId;
    }

    next();
  });

  return schema;
}

const schemaOptions = {
  timestamps: true,
  versionKey: '__v'
};

module.exports = {
  mongoose,
  tenantFields,
  normalizeTenantAlias,
  schemaOptions
};
