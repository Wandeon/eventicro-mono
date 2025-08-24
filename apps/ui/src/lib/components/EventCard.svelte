<script lang="ts">
	import { MapPin, Calendar } from 'lucide-svelte';
	export let event: {
		id: string;
		title: string;
		city?: string;
		start_time: string;
		category?: string;
		image_url?: string;
		price?: string;
		venue_name?: string;
	};

	// Transform API data to component format
	$: eventData = {
		href: `/events/${event.id}`,
		title: event.title,
		city: event.city || 'Unknown location',
		date: event.start_time ? new Date(event.start_time) : null,
		category: event.category || 'other',
		image: event.image_url
	};

	const categoryImages: Record<string, string> = {
		music: '/images/concert-event.jpg',
		festival: '/images/festival-event.jpg',
		sport: '/images/sports-event.jpg',
		theatre: '/images/theater-event.jpg'
	};

	const imageSrc = eventData.image ?? categoryImages[eventData.category] ?? '/images/concert-event.jpg';
</script>

<a
	href={eventData.href}
	class="group block overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
>
	<div class="aspect-video w-full overflow-hidden">
		<img
			src={imageSrc}
			alt={eventData.title}
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
	</div>
	<div class="p-6 space-y-4">
		<h3
			class="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors"
		>
			{eventData.title}
		</h3>
		<div class="flex items-center space-x-2 text-muted-foreground">
			<MapPin class="h-4 w-4" />
			<span class="text-sm">{eventData.city}</span>
		</div>
		{#if eventData.date}
			<div class="flex items-center space-x-2 text-muted-foreground">
				<Calendar class="h-4 w-4" />
				<span class="text-sm"
					>{eventData.date.toLocaleDateString('hr-HR', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})}</span
				>
			</div>
		{/if}
		{#if eventData.category}
			<div class="flex justify-start">
				<span
					class="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground capitalize"
					>{eventData.category}</span
				>
			</div>
		{/if}
	</div>
</a>
