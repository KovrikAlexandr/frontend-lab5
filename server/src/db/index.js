import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgres://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${
      process.env.POSTGRES_HOST || 'localhost'
    }:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'vinyls'}`,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PG error', err);
});

export default pool;
