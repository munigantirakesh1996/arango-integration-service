const app = require('./app');
const config = require('./config');
const { logger } = require('./middlewares/loggerMiddleware');

app.listen(config.server.port, () => {
  logger.log({
    level: 'info',
    message: `Server running on port ${config.server.port}`,
  });
});
