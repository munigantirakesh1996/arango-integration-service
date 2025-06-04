const joi = require('joi');

const validateAirportId = (airportId) => joi.string().regex(/^[a-zA-Z]+$/)
  .required()
  .validate(airportId);

module.exports = {
  validateAirportId
};