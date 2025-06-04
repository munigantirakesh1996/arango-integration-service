const joi = require('joi');

const validateId = (id) => joi.string().regex(/^[a-zA-Z0-9]+$/)
  .required()
  .validate(id);

module.exports = {
  validateId
};