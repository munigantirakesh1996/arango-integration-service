const express = require('express');
const router = express.Router();

const pingRoutes = require('./ping');
const airportRoutes = require('./airport');
const flightRoutes = require('./flight');

router.use('/ping', pingRoutes);
router.use('/airport', airportRoutes);
router.use('/flight', flightRoutes);

module.exports = router;
