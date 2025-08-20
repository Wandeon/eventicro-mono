import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { getPool } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
  const raw = url.searchParams.get('limit') ?? '50';
  const limit = Math.max(1, Math.min(Number.parseInt(raw, 10) || 50, 100));
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT id, title, city, venue_name, start_time, price_text
         FROM app.events
        ORDER BY start_time ASC
        LIMIT $1`,
      [limit]
    );
    return json({ items: rows, next_cursor: null });
  } catch (err) {
    console.error('[GET /api/events] query failed:', err);
    throw error(502, 'Database query failed');
  }
};

export const POST: RequestHandler = async ({ request }) => {
  // minimal validation
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') throw error(400, 'Invalid JSON');

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const city = typeof body.city === 'string' ? body.city.trim() : '';
  const venue_name = typeof body.venue_name === 'string' ? body.venue_name.trim() : '';
  const start_time = typeof body.start_time === 'string' ? body.start_time.trim() : '';
  const price_text = (typeof body.price_text === 'string' || body.price_text === null || body.price_text === undefined)
    ? (body.price_text ?? null)
    : null;

  if (!title || !city || !venue_name || !start_time) {
    throw error(400, 'Missing required fields: title, city, venue_name, start_time');
  }

  try {
    const pool = getPool();
    // Pass ISO-8601 start_time string; pg will cast to timestamptz
    const { rows } = await pool.query(
      `INSERT INTO app.events (title, city, venue_name, start_time, price_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, city, venue_name, start_time, price_text`,
      [title, city, venue_name, start_time, price_text]
    );
    return json({ item: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/events] insert failed:', err);
    throw error(502, 'Insert failed');
  }
};
