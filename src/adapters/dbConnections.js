const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const { DB_TYPES } = require('../utils/constants');
const { logger } = require('../middlewares/loggerMiddleware');
/**
 * Create a dynamic DB connection
 * @param {Object} config
 * @param {'mysql'|'postgres'} config.type
 * @returns {Promise<Connection|Pool>}
 */
const connectToDatabase = async (config) => {
  const { sourceType, ...dbConfig } = config || {};
  const dbType = sourceType.toLowerCase();

  try {
    switch (dbType) {
    case DB_TYPES.MYSQL: {
      const mysqlConn = await mysql.createConnection(dbConfig.sourceConfig);
      logger.log({ level: 'info', message: 'MySQL connection established' });
      return mysqlConn;
    }

    case DB_TYPES.POSTGRES: {
      const pgPool = new Pool(dbConfig.sourceConfig);
      // Validate connection (optional but recommended)
      await pgPool.query('SELECT 1');
      logger.log({ level: 'info', message: 'PostgreSQL connection established' });
      return pgPool;
    }

    default:
      throw new Error(`Unsupported database type: "${sourceType}"`);
    }
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Error connecting to ${dbType.toUpperCase()}: ${err.message}`,
      meta: { error: err }
    });
    throw err;
  }
};

module.exports = {
  connectToDatabase
};