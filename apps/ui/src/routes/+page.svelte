<script lang="ts">
  import EventCard from "$lib/components/EventCard.svelte";
  export let data: any;
  const items = data?.items ?? [];
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each items as e}
    <EventCard event={e} />
  {/each}
</div>
