function successResponse(res, { status = 200, message = 'Success', data = null, meta = {} } = {}) {
  return res.status(status).json({
    success: true,
    message,
    data,
    meta,
    errors: [],
  });
}

function errorResponse(res, { status = 400, message = 'Validation failed', data = null, errors = [] } = {}) {
  return res.status(status).json({
    success: false,
    message,
    data,
    errors,
  });
}

module.exports = {
  successResponse,
  errorResponse,
};
