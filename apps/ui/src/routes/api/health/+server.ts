import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { checkDatabaseHealth } from '$lib/db';

export const GET: RequestHandler = async () => {
	try {
		const dbHealthy = await checkDatabaseHealth();
		const status = dbHealthy ? 'ok' : 'degraded';
		
		return json({ 
			status,
			version: '1.0.0',
			git_sha: process.env.GIT_SHA || 'unknown',
			database: dbHealthy ? 'connected' : 'disconnected'
		});
	} catch (error) {
		console.error('[health check] Error:', error);
		return json({ 
			status: 'degraded',
			version: '1.0.0',
			git_sha: process.env.GIT_SHA || 'unknown',
			error: 'Health check failed'
		}, { status: 503 });
	}
};
