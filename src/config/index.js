require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,

  server: {
    port: process.env.PORT || 8080,
  },

  arango: {
    url: process.env.ARANGO_URL,
    database: process.env.ARANGO_DB,
    username: process.env.ARANGO_USER,
    password: process.env.ARANGO_PASSWORD,
  },
};

module.exports = config;
