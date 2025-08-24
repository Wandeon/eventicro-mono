<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	let mapEl: HTMLDivElement;

	onMount(async () => {
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
	});
</script>

<svelte:head><title>Map • EventiCRO</title></svelte:head>

<div style="height: calc(100vh - 64px);">
	<div bind:this={mapEl} id="map" style="height:100%;width:100%;"></div>
</div>
