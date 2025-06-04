const express = require('express');
const router = express.Router();

const pingRoutes = require('./ping');
const airportRoutes = require('./airport');

router.use('/ping', pingRoutes);
router.use('/airport', airportRoutes);

module.exports = router;
