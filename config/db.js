const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database/edusphere.db'), (err) => {
  if (err) console.error('Gagal terhubung ke database:', err.message);
  else console.log('Terhubung ke database SQLite.');
});

module.exports = db;
