const { logger } = require('../middlewares/loggerMiddleware');

const notFoundHandler = (req, res) => {
  const status = 404;
  const message = `${req.originalUrl} not found`;
  const type = 'NOT_FOUND';
  logger.log({
    level: 'error',
    message,
    meta: {
      status,
      type,
      method: req.method,
      url: req.originalUrl,
    },
  });
  res.status(status).json({ status, type, message });
};

module.exports = {
  notFoundHandler,
};