import initSqlJs from 'sql.js';

const loadDatabase = async (url) => {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.wasm`
  });

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buffer));

  return db;
};

export default loadDatabase;
