import { browser } from '$app/environment';

const BASE = browser ? '/api' : 'http://127.0.0.1:8787';

export async function listEvents(
  fetchFn: typeof fetch,
  params: { q?: string; cat?: string; when?: string; page?: number; per_page?: number; cursor?: string; city?: string } = {}
) {
  const url = new URL(`${BASE}/events`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  if (!url.searchParams.has('page')) url.searchParams.set('page', '1');
  if (!url.searchParams.has('per_page')) url.searchParams.set('per_page', '12');

  const res = await fetchFn(url.toString(), { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json() as any;

  const items = data.items ?? data.data ?? [];
  const total = Number(data.total ?? items.length);
  const page = Number(url.searchParams.get('page') ?? 1);
  const per_page = Number(url.searchParams.get('per_page') ?? 12);

  return { items, total, page, per_page };
}
