import { Pool } from 'pg';

let pool: Pool | undefined;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL;
    // Don't throw at module import time — initialize on first use
    if (!connectionString) {
      throw new Error('POSTGRES_URL is not set');
    }
    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000
    });
    pool.on('error', (err) => {
      console.error('[pg pool error]', err);
    });
  }
  return pool;
}
