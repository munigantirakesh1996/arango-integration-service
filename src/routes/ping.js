const express = require('express');
const router = express.Router();

const pingController = require('../controllers/pingController');
const commonController = require('../controllers/commonMethodController');

router.route('/')
  .get(pingController.ping)
  .all(commonController.notFoundHandler);


module.exports = router;