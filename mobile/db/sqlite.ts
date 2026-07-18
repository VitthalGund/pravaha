import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('pravaha.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS cash_flow_entries (
      client_entry_id TEXT PRIMARY KEY NOT NULL,
      enterprise_id TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      recorded_at TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0
    );
  `);
}
