import { browser } from '$app/environment';

const BASE = browser ? '/api' : 'http://127.0.0.1:8787';

export async function listEvents(
	fetchFn: typeof fetch,
	params: {
		q?: string;
		category?: string;
		cursor?: string;
		limit?: number;
		start_time_from?: string;
		start_time_to?: string;
		city?: string;
		lat?: number;
		lng?: number;
		radius_km?: number;
	} = {}
) {
	const url = new URL(`${BASE}/events`);
	
	// Map frontend parameters to API parameters
	const apiParams: Record<string, string> = {};
	
	if (params.q) apiParams.q = params.q;
	if (params.category) apiParams.category = params.category;
	if (params.cursor) apiParams.cursor = params.cursor;
	if (params.limit) apiParams.limit = params.limit.toString();
	if (params.start_time_from) apiParams.start_time_from = params.start_time_from;
	if (params.start_time_to) apiParams.start_time_to = params.start_time_to;
	if (params.city) apiParams.city = params.city;
	if (params.lat) apiParams.lat = params.lat.toString();
	if (params.lng) apiParams.lng = params.lng.toString();
	if (params.radius_km) apiParams.radius_km = params.radius_km.toString();

	// Add parameters to URL
	for (const [k, v] of Object.entries(apiParams)) {
		if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
	}

	const res = await fetchFn(url.toString(), { headers: { accept: 'application/json' } });
	if (!res.ok) throw new Error(`API error ${res.status}`);
	const data = (await res.json()) as { items: any[]; next_cursor: string | null };

	return {
		items: data.items || [],
		next_cursor: data.next_cursor,
		total: data.items?.length || 0,
		page: 1, // API uses cursor pagination, not page-based
		per_page: data.items?.length || 0
	};
}
