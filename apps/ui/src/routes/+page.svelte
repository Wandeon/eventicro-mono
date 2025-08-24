<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import Filters from '$lib/components/Filters.svelte';
	export let data: Record<string, unknown>;
	const items = data?.items ?? [];
</script>

<Filters />

{#if items.length === 0}
	<p class="text-center text-muted-foreground">Trenutno nema događaja.</p>
{/if}

<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each items as e (e.id || e.title)}
		<EventCard event={e} />
	{/each}
</div>
