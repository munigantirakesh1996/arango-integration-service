const mysql = require('mysql2/promise');

const connect = async (config) => {
  return mysql.createConnection(config);
}

const fetchMetadata = async (conn, dbName) => {
  const [tables] = await conn.execute(
    `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`, [dbName]
  );
  const tableNames = tables.map(t => t.TABLE_NAME);
  const primaryKeys = {};
  const foreignKeys = [];
  const indexes = {};

  for (const table of tableNames) {
    const [pkRes] = await conn.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = 'PRIMARY'`,
      [dbName, table]
    );
    primaryKeys[table] = pkRes[0]?.COLUMN_NAME || '_id';

    const [fkRes] = await conn.execute(`
      SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
      [dbName, table]
    );
    fkRes.forEach(fk => {
      foreignKeys.push({
        fromTable: table,
        fromColumn: fk.COLUMN_NAME,
        toTable: fk.REFERENCED_TABLE_NAME,
        toColumn: fk.REFERENCED_COLUMN_NAME,
      });
    });

    // Extract indexes
    const [idxRes] = await conn.execute(`
      SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `, [dbName, table]);
    indexes[table] = {};
    idxRes.forEach(idx => {
      if (!indexes[table][idx.INDEX_NAME]) {
        indexes[table][idx.INDEX_NAME] = {
          columns: [],
          unique: idx.NON_UNIQUE === 0
        };
      }
      indexes[table][idx.INDEX_NAME].columns.push(idx.COLUMN_NAME);
    });
  }

  return { tableNames, primaryKeys, foreignKeys, indexes };
}

const fetchTableData = async (conn, tableName) => {
  const [rows] = await conn.execute(`SELECT * FROM ${tableName}`);
  return rows;
}

const disconnect = async (conn) => {
  await conn.end();
}

module.exports = { connect, fetchMetadata, fetchTableData, disconnect };