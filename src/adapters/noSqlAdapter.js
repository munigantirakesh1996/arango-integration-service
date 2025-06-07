const { connectToDatabase } = require('./dbConnections');
const { logger } = require('../middlewares/loggerMiddleware');

const connect = async (config) => await connectToDatabase(config);

const fetchMetadata = async (db) => {
  const tableNames = await db.listCollections().toArray();
  const collectionNames = tableNames.map(col => col.name);

  const primaryKeys = {};
  const indexes = {};
  // MongoDB doesn't enforce foreign keys; custom app logic can infer them if needed
  const foreignKeys = []; 

  for (const name of collectionNames) {
    primaryKeys[name] = '_id';

    const collectionIndexes = await db.collection(name).indexes();
    indexes[name] = {};

    collectionIndexes.forEach(idx => {
      indexes[name][idx.name] = {
        columns: Object.keys(idx.key),
        unique: idx.unique || false,
      };
    });
  }

  return {
    tableNames: collectionNames,
    primaryKeys,
    foreignKeys, // empty by design
    indexes
  };
};

const fetchCollectionData = async (db, collectionName) => 
  await db.collection(collectionName).find().toArray();

const streamCollectionDataInBatches = async (db, collectionName, batchSize, onBatch) => {
  const cursor = db.collection(collectionName).find();
  let batch = [];
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    batch.push(doc);
    if (batch.length >= batchSize) {
      await onBatch(batch);
      batch = [];
    }
  }
  if (batch.length > 0) {
    await onBatch(batch);
  }
};

const disconnect = async (db) => {
  if (db && db.client) {
    await db.client.close();
    logger.log({
      level: 'info',
      message: 'MongoDB connection closed'
    });
  }
};

module.exports = { 
  connect, fetchMetadata, fetchCollectionData, disconnect, 
  streamCollectionDataInBatches };