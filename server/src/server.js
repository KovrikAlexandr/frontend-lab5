import 'dotenv/config';
import app from './app.js';
import pool from './db/index.js';
import { runMigrations } from './db/migrate.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query('SELECT 1');
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
