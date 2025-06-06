require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,

  server: {
    port: process.env.PORT || 8080,
  },

  arango: {
    system: { // System database connection (usually "_system")
      url: process.env.ARANGO_SYS_URL,
      database: process.env.ARANGO_SYS_DB,
      username: process.env.ARANGO_SYS_USER,
      password: process.env.ARANGO_SYS_PASSWORD
    },
    app: { // Application (local) database connection
      url: process.env.ARANGO_APP_URL,
      database: process.env.ARANGO_APP_DB,
      username: process.env.ARANGO_APP_USER,
      password: process.env.ARANGO_APP_PASSWORD
    }
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },

  queue: {
    name: process.env.QUEUE_NAME,
    hostId: process.env.QUEUE_HOST_ID,
  }
};

module.exports = config;
