import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import pool from './index.js';

export async function runMigrations() {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const sql = fs.readFileSync(path.join(__dirname, 'migrations.sql'), 'utf-8');
  await pool.query(sql);
}
