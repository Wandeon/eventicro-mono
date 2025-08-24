<script lang="ts">
	import { MapPin, Calendar } from 'lucide-svelte';
	export let event: {
		href: string;
		title: string;
		city: string;
		date: Date | null;
		category: string;
		image?: string;
	};

	const categoryImages: Record<string, string> = {
		music: '/images/concert-event.jpg',
		festival: '/images/festival-event.jpg',
		sport: '/images/sports-event.jpg',
		theatre: '/images/theater-event.jpg'
	};

	const imageSrc = event.image ?? categoryImages[event.category] ?? '/images/concert-event.jpg';
</script>

<a
	href={event.href}
	class="group block overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
>
	<div class="aspect-video w-full overflow-hidden">
		<img
			src={imageSrc}
			alt={event.title}
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
	</div>
	<div class="p-6 space-y-4">
		<h3
			class="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors"
		>
			{event.title}
		</h3>
		<div class="flex items-center space-x-2 text-muted-foreground">
			<MapPin class="h-4 w-4" />
			<span class="text-sm">{event.city}</span>
		</div>
		{#if event.date}
			<div class="flex items-center space-x-2 text-muted-foreground">
				<Calendar class="h-4 w-4" />
				<span class="text-sm"
					>{event.date.toLocaleDateString('hr-HR', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})}</span
				>
			</div>
		{/if}
		{#if event.category}
			<div class="flex justify-start">
				<span
					class="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground capitalize"
					>{event.category}</span
				>
			</div>
		{/if}
	</div>
</a>
