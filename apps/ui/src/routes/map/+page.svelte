<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	let mapEl: HTMLDivElement;
	let mapError = false;
	let mapLoading = true;

	onMount(async () => {
		try {
			const L = await import('leaflet');

			// Define the bounding box for Croatia
			const corner1 = L.latLng(46.55, 19.45); // Northeast
			const corner2 = L.latLng(42.38, 13.5); // Southwest
			const bounds = L.latLngBounds(corner1, corner2);

			// Initialize the map with the bounds and a suitable zoom level
			const map = L.map(mapEl, {
				maxBounds: bounds,
				minZoom: 7
			}).setView([45.2, 15.5], 7);

			L.tileLayer('https://tiles.eventicro.hr/styles/basic-preview/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenMapTiles &copy; OpenStreetMap contributors',
				maxZoom: 19
			}).addTo(map);
			
			mapLoading = false;
		} catch (error) {
			console.error('Failed to load map:', error);
			mapError = true;
			mapLoading = false;
		}
	});
</script>

<svelte:head><title>Map • EventiCRO</title></svelte:head>

<div style="height: calc(100vh - 64px);">
	{#if mapLoading}
		<div class="flex items-center justify-center h-full">
			<div class="text-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
				<p class="text-muted-foreground">Loading map...</p>
			</div>
		</div>
	{:else if mapError}
		<div class="flex items-center justify-center h-full">
			<div class="text-center">
				<p class="text-muted-foreground mb-4">Failed to load map</p>
				<button 
					onclick={() => window.location.reload()} 
					class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
				>
					Retry
				</button>
			</div>
		</div>
	{:else}
		<div bind:this={mapEl} id="map" style="height:100%;width:100%;"></div>
	{/if}
</div>
