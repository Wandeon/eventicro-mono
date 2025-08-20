export const ssr = true;

export async function load({ fetch }) {
  const res = await fetch('/api/events?limit=12', { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    return { items: [], error: `API error ${res.status}` };
  }
  const data = await res.json();
  return { items: data.items ?? [], next: data.next_cursor ?? null };
}
