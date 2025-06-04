const { Database } = require('arangojs');
const config = require('../config');

const db = new Database({
  url: config.arango.url,
  databaseName: config.arango.database,
  auth: {
    username: config.arango.username,
    password: config.arango.password,
  }    
});

module.exports = db;
