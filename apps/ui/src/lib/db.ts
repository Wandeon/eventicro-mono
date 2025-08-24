import { Pool } from 'pg';

let pool: Pool | undefined;

export function getPool(): Pool {
	if (!pool) {
		const connectionString = process.env.POSTGRES_URL;
		// Don't throw at module import time — initialize on first use
		if (!connectionString) {
			console.error('POSTGRES_URL environment variable is not set');
			throw new Error('POSTGRES_URL is not set. Please configure your database connection.');
		}

		pool = new Pool({
			connectionString,
			max: 20, // Increased for better performance
			idleTimeoutMillis: 30_000,
			connectionTimeoutMillis: 10_000, // Increased timeout
			allowExitOnIdle: true,
			// Add SSL configuration for production
			ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
		});

		pool.on('error', (err) => {
			console.error('[pg pool error]', err);
		});

		pool.on('connect', () => {
			console.log('[pg] New client connected to database');
		});

		pool.on('remove', () => {
			console.log('[pg] Client removed from pool');
		});
	}
	return pool;
}

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
	try {
		const pool = getPool();
		const client = await pool.connect();
		await client.query('SELECT 1');
		client.release();
		return true;
	} catch (error) {
		console.error('[db health check] Failed:', error);
		return false;
	}
}

// Graceful shutdown
export async function closePool(): Promise<void> {
	if (pool) {
		await pool.end();
		pool = undefined;
	}
}
