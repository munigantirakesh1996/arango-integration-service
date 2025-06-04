const { logger } = require('./loggerMiddleware');

/**
 * Helper to format Joi validation errors.
 */
const formatJoiError = (err) => ({
  status: 400,
  message: err.details?.map(d => d.message).join(', ') || 'Validation error',
  type: 'VALIDATION_ERROR',
});

/**
 * Helper to format ArangoDB errors.
 */
const formatArangoError = (err) => ({
  status: err.code || 500,
  message: err.message || 'Database error',
  type: 'ARANGODB_ERROR',
});

/**
 * Express error-handling middleware.
 * Handles generic, Joi, and ArangoDB errors.
 */
/* eslint-disable-next-line no-unused-vars */
const errorMiddleware = (err, req, res, next) =>{
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let type = err.type || 'INTERNAL_ERROR';

  // Handle Joi validation errors
  if (err.isJoi) {
    const joiError = formatJoiError(err);
    status = joiError.status;
    message = joiError.message;
    type = joiError.type;
  }

  // Handle ArangoDB errors (arangojs sets errorNum and code)
  else if (err.errorNum && err.code) {
    const arangoError = formatArangoError(err);
    status = arangoError.status;
    message = arangoError.message;
    type = arangoError.type;
  }

  // Log the error with stack trace and request info
  logger.log({
    level: 'error',
    message,
    meta: {
      status,
      type,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    }
  });

  res.status(status).json({
    status,
    message,
    type,
  });
};

module.exports = errorMiddleware;