import type { PageServerLoad } from './$types';
import { listEvents } from '$lib/api/client';

export const load: PageServerLoad = async ({ fetch, url }) => {
	try {
		const q = url.searchParams.get('q') ?? undefined;
		const category = url.searchParams.get('cat') ?? undefined; // Map 'cat' to 'category'
		const when = url.searchParams.get('when') ?? undefined;
		
		// Convert 'when' parameter to date range
		let start_time_from: string | undefined;
		let start_time_to: string | undefined;
		
		if (when) {
			const now = new Date();
			switch (when) {
				case 'today':
					start_time_from = now.toISOString().split('T')[0] + 'T00:00:00Z';
					start_time_to = now.toISOString().split('T')[0] + 'T23:59:59Z';
					break;
				case 'weekend':
					const friday = new Date(now);
					friday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7);
					const sunday = new Date(friday);
					sunday.setDate(friday.getDate() + 2);
					start_time_from = friday.toISOString().split('T')[0] + 'T00:00:00Z';
					start_time_to = sunday.toISOString().split('T')[0] + 'T23:59:59Z';
					break;
				case 'next-week':
					const nextWeek = new Date(now);
					nextWeek.setDate(now.getDate() + 7);
					const weekAfter = new Date(nextWeek);
					weekAfter.setDate(nextWeek.getDate() + 7);
					start_time_from = nextWeek.toISOString().split('T')[0] + 'T00:00:00Z';
					start_time_to = weekAfter.toISOString().split('T')[0] + 'T23:59:59Z';
					break;
			}
		}
		
		const data = await listEvents(fetch, { 
			q, 
			category, 
			limit: 12,
			start_time_from,
			start_time_to
		});
		
		return { 
			...data, 
			q: q ?? '', 
			cat: category ?? '', 
			when: when ?? '' 
		};
	} catch (err) {
		console.error('home load error', err);
		return { 
			items: [], 
			total: 0, 
			page: 1, 
			per_page: 12, 
			q: '', 
			cat: '', 
			when: '',
			next_cursor: null
		};
	}
};
