import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { getPool } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Parse and validate query parameters
		const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
		const per_page = Math.max(
			1,
			Math.min(parseInt(url.searchParams.get('per_page') || '12', 10), 100)
		);
		const q = url.searchParams.get('q')?.trim();
		const cat = url.searchParams.get('cat')?.trim();
		const city = url.searchParams.get('city')?.trim();

		const offset = (page - 1) * per_page;

		// Build dynamic query
		let whereClause = '';
		const params: unknown[] = [];
		let paramIndex = 1;

		if (q) {
			whereClause += ' WHERE title ILIKE $' + paramIndex;
			params.push(`%${q}%`);
			paramIndex++;
		}

		if (cat) {
			whereClause += whereClause ? ' AND' : ' WHERE';
			whereClause += ' category = $' + paramIndex;
			params.push(cat);
			paramIndex++;
		}

		if (city) {
			whereClause += whereClause ? ' AND' : ' WHERE';
			whereClause += ' city ILIKE $' + paramIndex;
			params.push(`%${city}%`);
			paramIndex++;
		}

		const pool = getPool();

		// Get total count
		const countQuery = `SELECT COUNT(*) FROM app.events${whereClause}`;
		const countResult = await pool.query(countQuery, params);
		const total = parseInt(countResult.rows[0].count, 10);

		// Get paginated results
		const dataQuery = `
      SELECT id, title, city, venue_name, start_time, price_text, category
      FROM app.events
      ${whereClause}
      ORDER BY start_time ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

		const dataParams = [...params, per_page, offset];
		const { rows } = await pool.query(dataQuery, dataParams);

		return json({
			items: rows,
			total,
			page,
			per_page,
			total_pages: Math.ceil(total / per_page),
			has_next: page < Math.ceil(total / per_page),
			has_prev: page > 1
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
		const city = typeof body.city === 'string' ? body.city.trim() : '';
		const venue_name = typeof body.venue_name === 'string' ? body.venue_name.trim() : '';
		const start_time = typeof body.start_time === 'string' ? body.start_time.trim() : '';
		const price_text =
			typeof body.price_text === 'string' ||
			body.price_text === null ||
			body.price_text === undefined
				? (body.price_text ?? null)
				: null;
		const category = typeof body.category === 'string' ? body.category.trim() : null;

		// Validate required fields
		if (!title || !city || !venue_name || !start_time) {
			throw error(400, 'Missing required fields: title, city, venue_name, start_time');
		}

		// Validate date format
		const startDate = new Date(start_time);
		if (isNaN(startDate.getTime())) {
			throw error(400, 'Invalid start_time format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)');
		}

		const pool = getPool();

		// Insert new event
		const { rows } = await pool.query(
			`INSERT INTO app.events (title, city, venue_name, start_time, price_text, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, city, venue_name, start_time, price_text, category`,
			[title, city, venue_name, start_time, price_text, category]
		);

		return json({ item: rows[0] }, { status: 201 });
	} catch (err) {
		if (err.status) throw err; // Re-throw SvelteKit errors
		console.error('[POST /api/events] insert failed:', err);
		throw error(502, 'Insert failed');
	}
};
