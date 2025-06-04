const express = require('express');
const router = express.Router();

const pingRoutes = require('./ping');

router.use('/ping', pingRoutes);

module.exports = router;
