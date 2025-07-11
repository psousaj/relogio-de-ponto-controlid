import { Database } from 'bun:sqlite';

// Disable this for production
export const db = new Database('db.sql', { create: true });

// Initialize the database schema
db.run(`
    CREATE TABLE IF NOT EXISTS reps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        ip TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_rep_ip ON reps (ip);

    -- Tabela de logs do relógio
    CREATE TABLE IF NOT EXISTS rep_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rep_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rep_id) REFERENCES reps(id)
    );
    CREATE INDEX IF NOT EXISTS idx_rep_log_rep_id ON rep_log (rep_id);

    -- Tabela de usuários
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,  
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);
