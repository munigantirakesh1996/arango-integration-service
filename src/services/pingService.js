const { logger } = require('../middlewares/loggerMiddleware');
const db = require('../database/database');

const checkDBStatus = async () => {
  try {
    const arangoVersion = await db.version();
    logger.log({
      level: 'info',
      message: 'pingService - checkDBStatus - version',
      meta: { version: arangoVersion.version }
    });

    return {
      status: 'UP',
      arangoVersion: arangoVersion.version,
    };
  } catch (error) {
    logger.log({
      level: 'error',
      message: 'pingService - checkDBStatus - error',
      meta: { message: error.message || 'Failed to ping DB' }
    });
    return {
      status: 'DOWN',
    };
  }
};

module.exports = {
  checkDBStatus,
};
