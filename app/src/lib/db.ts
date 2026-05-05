import Database from "better-sqlite3"
import fs from "node:fs"
import path from "node:path"

const DB_FILE = path.join(process.cwd(), "data", "app.db")

function initDb(db: Database.Database) {
  db.pragma("journal_mode = WAL")
  db.exec(`
    create table if not exists users (
      id text primary key,
      email text not null unique,
      password_hash text not null,
      created_at integer not null
    );

    create table if not exists sessions (
      id text primary key,
      user_id text not null,
      token_hash text not null unique,
      expires_at integer not null,
      created_at integer not null,
      foreign key (user_id) references users(id) on delete cascade
    );

    create index if not exists idx_sessions_token_hash on sessions(token_hash);
    create index if not exists idx_sessions_user_id on sessions(user_id);
  `)
}

const globalForDb = globalThis as unknown as { __db?: Database.Database }

export function getDb() {
  if (!globalForDb.__db) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
    const db = new Database(DB_FILE)
    initDb(db)
    globalForDb.__db = db
  }
  return globalForDb.__db
}
