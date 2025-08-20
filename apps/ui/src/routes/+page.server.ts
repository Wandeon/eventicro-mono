import type { PageServerLoad } from './$types';
import { listEvents } from '$lib/api/client';

export const load: PageServerLoad = async ({ fetch, url }) => {
  try {
    const q = url.searchParams.get('q') ?? undefined;
    const cat = url.searchParams.get('cat') ?? undefined;
    const page = Number(url.searchParams.get('page') ?? 1);
    const per_page = Number(url.searchParams.get('per_page') ?? 12);
    const data = await listEvents(fetch, { q, cat, page, per_page });
    return { ...data, q: q ?? '', cat: cat ?? '' };
  } catch (err) {
    console.error('home load error', err);
    return { items: [], total: 0, page: 1, per_page: 12, q: '', cat: '' };
  }
};
