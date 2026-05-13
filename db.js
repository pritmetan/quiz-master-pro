const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'quiz.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );
`);

function columnNames(table) {
  return db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
}

function migrateUsers() {
  let cols = columnNames('users');
  if (!cols.includes('display_name')) {
    db.exec(`ALTER TABLE users ADD COLUMN display_name TEXT NOT NULL DEFAULT '';`);
    db.exec(`UPDATE users SET display_name = login WHERE display_name = '' OR display_name IS NULL`);
    cols = columnNames('users');
  }
  if (!cols.includes('games_played')) {
    db.exec(`ALTER TABLE users ADD COLUMN games_played INTEGER NOT NULL DEFAULT 0`);
    cols = columnNames('users');
  }
  if (!cols.includes('games_won')) {
    db.exec(`ALTER TABLE users ADD COLUMN games_won INTEGER NOT NULL DEFAULT 0`);
    cols = columnNames('users');
  }
  if (!cols.includes('total_score')) {
    db.exec(`ALTER TABLE users ADD COLUMN total_score INTEGER NOT NULL DEFAULT 0`);
  }
}

migrateUsers();

module.exports = { db };
