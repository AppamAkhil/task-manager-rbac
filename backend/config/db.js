const sqlite3 = require('sqlite3');
const path = require('path');

// Database file at project root/backend/database.sqlite
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

module.exports = db;