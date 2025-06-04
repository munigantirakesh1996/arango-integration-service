const { logger } = require('../middlewares/loggerMiddleware');
const pingService = require('../services/pingService');

const ping = async (req, res) => {
  const pingResp = await pingService.checkDBStatus();
  logger.log({
    level: 'info',
    message: 'pingController - ping - pingResp',
    meta: { pingResp }
  });

  res.json(pingResp);
};

module.exports = {
  ping
};
