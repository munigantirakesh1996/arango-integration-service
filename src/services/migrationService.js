const adapters = require('../adapters/index');
const arango = require('../database/database');
const { processInBatches } = require('../utils/batchProcessor');
const { Database } = require('arangojs');
const config = require('../config');

const migrate = async ({ sourceType, sourceConfig }) => {
  try {
    const adapter = adapters[sourceType];
    if (!adapter) throw new Error(`Unsupported sourceType: ${sourceType}`);

    const conn = await adapter.connect(sourceConfig);

    const { tableNames, primaryKeys, foreignKeys, indexes } = await adapter.fetchMetadata(conn, sourceConfig.database || sourceConfig.dbName);

    console.log({ tableNames, primaryKeys, foreignKeys, indexes })
    // --- Create database in ArangoDB if it doesn't exist ---
    const dbName = sourceConfig.database;
    const sysDb = new Database(
      {
        url: config.arango.url,
        databaseName: config.arango.database,
        auth: {
          username: config.arango.username,
          password: config.arango.password,
        }
      }

    ); // Use system DB connection
    const dbList = await sysDb.listDatabases();

    console.log('Available databases:', dbList);

    let dbInstance;
    if (dbList.includes(dbName)) {
      console.log('Database exists:', dbName);
      dbInstance = new Database({
        url: config.arango.url,
        databaseName: dbName,
        auth: {
          username: config.arango.username,
          password: config.arango.password,
        }
      });
    } else {
      await sysDb.createDatabase(dbName);
      // Optionally, grant permissions to a user (if needed)
      // await sysDb.grantDatabaseAccess(dbName, 'your-username');
      console.log('Database created:', dbName);
      dbInstance = new Database({
        url: config.arango.url,
        databaseName: dbName,
        auth: {
          username: config.arango.username,
          password: config.arango.password,
        }
      });
    }

    const docColls = {};
    for (const table of tableNames) {
      const coll = dbInstance.collection(table);
      await coll.create().catch(() => { });
      docColls[table] = coll;
    }

    // Create hash indexes in ArangoDB based on RDBMS indexes
    for (const table of tableNames) {
      if (!indexes[table]) continue;
      const coll = docColls[table];
      for (const [indexName, idx] of Object.entries(indexes[table])) {
        // Skip primary index (already exists in ArangoDB)
        if (indexName === 'PRIMARY') continue;
        // Create hash index, set unique if the RDBMS index is unique
        await coll.ensureIndex({ type: 'hash', fields: idx.columns, unique: idx.unique }).catch(() => { });
      }
    }

    for (const table of tableNames) {
      const rows = await adapter.fetchTableData(conn, table);
      const pk = primaryKeys[table];
      const docs = rows.map(row => {
        const copy = { ...row };
        copy._key = String(copy[pk]);
        delete copy[pk];
        return copy;
      });
      await processInBatches(docs, 1000, 5, async batch => {
        await docColls[table].import(batch, { overwrite: true });
      });
    }

    for (const fk of foreignKeys) {
      const edgeName = `${fk.fromTable}_to_${fk.toTable}`;
      await dbInstance.createEdgeCollection(edgeName).catch(() => { });
      // Always get the collection object
      const edgeColl = dbInstance.collection(edgeName);

      const rows = await adapter.fetchTableData(conn, fk.fromTable);
      const edges = rows.map(r => {
        const fromKey = String(r[primaryKeys[fk.fromTable]]);
        const toKey = String(r[fk.fromColumn]);
        if (!toKey) return null;
        return { _from: `${fk.fromTable}/${fromKey}`, _to: `${fk.toTable}/${toKey}` };
      }).filter(e => e);

      await processInBatches(edges, 1000, 5, async batch => {
        await edgeColl.import(batch, { overwrite: true });
      });
    }

    await adapter.disconnect(conn);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

module.exports = { migrate };