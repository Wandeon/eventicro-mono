<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
</script>

<Header />

<main class="container mx-auto p-4 md:p-8">
  <slot />
</main>
