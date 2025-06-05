const { logger } = require('../middlewares/loggerMiddleware');
const { migrate } = require('../services/migrationService');

const handleMigration = async (req, res, next) => {
  try {
    const sourceDbDetails = req.body;
    logger.log({
      level: 'info',
      message: 'migrationController - handleMigration - input',
      meta: { reqBody: sourceDbDetails }
    });

    //Need to include Validator herer
    // if (!sourceType || !sourceConfig) {
    //   return res.status(400).json({ error: 'Both sourceType and sourceConfig are required' });
    // }

    await migrate(sourceDbDetails);
    res.json({ message: 'Migration successful' });
  } catch (error) {
      logger.log({
      level: 'error',
      message: 'migrationController - handleMigration - error',
      meta: { message: error.message }
    });
    next(error);
  }
}

module.exports = { handleMigration };