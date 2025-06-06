const { MongoClient } = require('mongodb');

const connect = async (config) => {
  const client = new MongoClient(config.url, config.options);
  await client.connect();
  return client.db(config.dbName);
};

const fetchMetadata = async (db) => {
  const collections = await db.listCollections().toArray();
  const tableNames = collections.map(c => c.name);
  const primaryKeys = tableNames.reduce((acc, name) => (acc[name] = '_id', acc), {});
  const foreignKeys = []; // Extend this for your Mongo schema relationships
  return { tableNames, primaryKeys, foreignKeys };
};

const fetchTableData = async (db, tableName) => db.collection(tableName).find().toArray();

const disconnect = async (db) => {
  await db.client.close();
};

module.exports = { connect, fetchMetadata, fetchTableData, disconnect };