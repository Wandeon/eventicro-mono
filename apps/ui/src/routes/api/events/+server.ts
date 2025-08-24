import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { getPool } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Parse and validate query parameters
		const limit = Math.max(1, Math.min(parseInt(url.searchParams.get('limit') || '12', 10), 50));
		const cursor = url.searchParams.get('cursor')?.trim();
		const q = url.searchParams.get('q')?.trim();
		const category = url.searchParams.get('category')?.trim();
		const city = url.searchParams.get('city')?.trim();
		const start_time_from = url.searchParams.get('start_time_from')?.trim();
		const start_time_to = url.searchParams.get('start_time_to')?.trim();
		const lat = url.searchParams.get('lat') ? parseFloat(url.searchParams.get('lat')!) : null;
		const lng = url.searchParams.get('lng') ? parseFloat(url.searchParams.get('lng')!) : null;
		const radius_km = url.searchParams.get('radius_km') ? parseFloat(url.searchParams.get('radius_km')!) : null;

		// Build dynamic query
		let whereClause = '';
		const params: unknown[] = [];
		let paramIndex = 1;

		if (q) {
			whereClause += ' WHERE (title ILIKE $' + paramIndex + ' OR description ILIKE $' + paramIndex + ')';
			params.push(`%${q}%`);
			paramIndex++;
		}

		if (category) {
			whereClause += whereClause ? ' AND' : ' WHERE';
			whereClause += ' category = $' + paramIndex;
			params.push(category);
			paramIndex++;
		}

		if (city) {
			whereClause += whereClause ? ' AND' : ' WHERE';
			whereClause += ' city ILIKE $' + paramIndex;
			params.push(`%${city}%`);
			paramIndex++;
		}

		if (start_time_from) {
			whereClause += whereClause ? ' AND' : ' WHERE';
			whereClause += ' start_time >= $' + paramIndex;
			params.push(start_time_from);
			paramIndex++;
		}

		if (start_time_to) {
			whereClause += whereClause ? ' AND' : ' WHERE';
			whereClause += ' start_time <= $' + paramIndex;
			params.push(start_time_to);
			paramIndex++;
		}

		// Add cursor-based pagination
		if (cursor) {
			whereClause += whereClause ? ' AND' : ' WHERE';
			whereClause += ' (start_time, id) > ($' + paramIndex + ', $' + (paramIndex + 1) + ')';
			// Parse cursor (assuming format: "start_time|id")
			const [cursorTime, cursorId] = cursor.split('|');
			params.push(cursorTime, cursorId);
			paramIndex += 2;
		}

		const pool = getPool();

		// Get paginated results
		const dataQuery = `
      SELECT id, title, description, start_time, end_time, city, venue_name, price, category, image_url, url, verified
      FROM app.events
      ${whereClause}
      ORDER BY start_time ASC, id ASC
      LIMIT $${paramIndex}
    `;

		const dataParams = [...params, limit];
		const { rows } = await pool.query(dataQuery, dataParams);

		// Generate next cursor
		let next_cursor: string | null = null;
		if (rows.length === limit) {
			const lastRow = rows[rows.length - 1];
			next_cursor = `${lastRow.start_time}|${lastRow.id}`;
		}

		return json({
			items: rows,
			next_cursor
		});
	} catch (err) {
		console.error('[GET /api/events] query failed:', err);
		throw error(502, 'Database query failed');
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Parse and validate request body
		const body = await request.json().catch(() => null);
		if (!body || typeof body !== 'object') {
			throw error(400, 'Invalid JSON');
		}

		const title = typeof body.title === 'string' ? body.title.trim() : '';
		const description = typeof body.description === 'string' ? body.description.trim() : null;
		const city = typeof body.city === 'string' ? body.city.trim() : '';
		const venue_name = typeof body.venue_name === 'string' ? body.venue_name.trim() : '';
		const start_time = typeof body.start_time === 'string' ? body.start_time.trim() : '';
		const end_time = typeof body.end_time === 'string' ? body.end_time.trim() : null;
		const price = typeof body.price === 'string' ? body.price.trim() : null;
		const category = typeof body.category === 'string' ? body.category.trim() : null;
		const image_url = typeof body.image_url === 'string' ? body.image_url.trim() : null;
		const url = typeof body.url === 'string' ? body.url.trim() : null;

		// Validate required fields
		if (!title || !city || !start_time) {
			throw error(400, 'Missing required fields: title, city, start_time');
		}

		// Validate date format
		const startDate = new Date(start_time);
		if (isNaN(startDate.getTime())) {
			throw error(400, 'Invalid start_time format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)');
		}

		if (end_time) {
			const endDate = new Date(end_time);
			if (isNaN(endDate.getTime())) {
				throw error(400, 'Invalid end_time format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)');
			}
		}

		const pool = getPool();

		// Insert new event
		const { rows } = await pool.query(
			`INSERT INTO app.events (title, description, city, venue_name, start_time, end_time, price, category, image_url, url, verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false)
       RETURNING id, title, description, start_time, end_time, city, venue_name, price, category, image_url, url, verified`,
			[title, description, city, venue_name, start_time, end_time, price, category, image_url, url]
		);

		return json({ item: rows[0] }, { status: 201 });
	} catch (err) {
		if (err.status) throw err; // Re-throw SvelteKit errors
		console.error('[POST /api/events] insert failed:', err);
		throw error(502, 'Insert failed');
	}
};
