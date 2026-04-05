import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('alarm_app.db');
  await initializeSchema(db);

  return db;
}

async function initializeSchema(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS alarms (
      id TEXT PRIMARY KEY NOT NULL,
      hour INTEGER NOT NULL,
      minute INTEGER NOT NULL,
      label TEXT DEFAULT '',
      sound_id TEXT DEFAULT 'default',
      sound_uri TEXT,
      repeat_days TEXT DEFAULT '[]',
      is_enabled INTEGER NOT NULL DEFAULT 1,
      next_trigger_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_alarms_enabled ON alarms(is_enabled);
    CREATE INDEX IF NOT EXISTS idx_alarms_next_trigger ON alarms(next_trigger_at);
  `);
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
