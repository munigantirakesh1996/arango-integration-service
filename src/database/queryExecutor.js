const db = require('./database');
const { logger } = require('../middlewares/loggerMiddleware');

const executeAQL = async (query, bindVars = {}) => {
  try {
    logger.log({
      level: 'info',
      message: 'Executing AQL Query',
      meta: { query, bindVars }
    });
    
    const cursor = await db.query(query, bindVars);
    return await cursor.all(); // safer for multiple results
  } catch (error) {
    logger.log({
      level: 'error',
      message: 'AQL Execution Error',
      meta: { error: error.message, query, bindVars }
    });
    throw error;
  }
};

module.exports = executeAQL;