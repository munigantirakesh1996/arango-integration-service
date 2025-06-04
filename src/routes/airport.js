const express = require('express');
const router = express.Router();

const airportController = require('../controllers/airportController');
const commonController = require('../controllers/commonMethodController');

router.route('/')
  .get(airportController.getAirports)
  // .post(airportController.addAirport)
  // .put(airportController.updateAirport)
  // .delete(airportController.deleteAirport)
  .all(commonController.notFoundHandler);

router.route('/:id')
  .get(airportController.getAirportById);


module.exports = router;