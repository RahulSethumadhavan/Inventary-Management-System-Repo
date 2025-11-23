const path = require('path');

// Use PostgreSQL for production (Vercel), SQLite for local development
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;

let db;

if (isProduction && process.env.DATABASE_URL) {
  // PostgreSQL for production (Supabase)
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Initialize PostgreSQL tables
  pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      unit TEXT,
      category TEXT,
      brand TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      status TEXT,
      image TEXT
    )
  `).catch(err => console.error('Error creating products table:', err));

  pool.query(`
    CREATE TABLE IF NOT EXISTS inventory_history (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id),
      old_quantity INTEGER,
      new_quantity INTEGER,
      change_date TEXT,
      user_info TEXT
    )
  `).catch(err => console.error('Error creating inventory_history table:', err));

  db = {
    all: async (text, params = []) => {
      const result = await pool.query(text, params);
      return result.rows;
    },
    get: async (text, params = []) => {
      const result = await pool.query(text, params);
      return result.rows[0];
    },
    run: async (text, params = []) => {
      const result = await pool.query(text + ' RETURNING id', params);
      return { lastID: result.rows[0]?.id, changes: result.rowCount };
    }
  };

  console.log('Connected to PostgreSQL database');
} else {
  // SQLite for local development
  const sqlite3 = require('sqlite3').verbose();
  const DB_PATH = path.resolve(__dirname, './inventory.db');

  const sqliteDb = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Failed to connect to SQLite DB', err);
    } else {
      console.log('Connected to SQLite DB at', DB_PATH);
    }
  });

  sqliteDb.serialize(() => {
    sqliteDb.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      unit TEXT,
      category TEXT,
      brand TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      status TEXT,
      image TEXT
    )`);

    sqliteDb.run(`CREATE TABLE IF NOT EXISTS inventory_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      old_quantity INTEGER,
      new_quantity INTEGER,
      change_date TEXT,
      user_info TEXT,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`);
  });

  // Wrap SQLite methods to match PostgreSQL interface
  db = {
    all: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    },
    get: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqliteDb.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    },
    run: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqliteDb.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve(this);
        });
      });
    }
  };
}

module.exports = db;
