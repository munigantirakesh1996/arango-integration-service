const winston = require('winston');

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // You can add file transports here if needed
    // new winston.transports.File({ filename: 'logs/app.log' })
  ],
});

// Express middleware for logging requests
const reqLoggerMiddleware = (req, res, next) => {
  logger.log({
    level: 'info',
    message: 'Incoming request',
    meta: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    }
  });
  next();
};

module.exports = {
  logger,
  reqLoggerMiddleware,
};