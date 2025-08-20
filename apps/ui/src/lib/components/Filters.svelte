<script lang="ts">
  import { page } from "$app/stores";
  // current query params
  $: q = $page.url.searchParams.get("q") ?? "";
  $: cat = $page.url.searchParams.get("cat") ?? "";
  $: when = $page.url.searchParams.get("when") ?? "";

  function link(params: Record<string,string|number|undefined>) {
    const sp = new URLSearchParams($page.url.searchParams);
    for (const [k,v] of Object.entries(params)) {
      if (v === undefined || v === "") sp.delete(k); else sp.set(k,String(v));
    }
    sp.delete("page"); // reset paging
    return `/?${sp.toString()}`;
  }

  const cats = [
    { id: "music", label: "Glazba" },
    { id: "sport", label: "Sport" },
    { id: "theatre", label: "Kazalište" },
    { id: "festival", label: "Festivali" }
  ];
</script>

<!-- When tabs -->
<div class="mb-4 flex flex-wrap gap-2">
  {#each [
    { id: "", label: "Sve" },
    { id: "today", label: "Danas" },
    { id: "weekend", label: "Vikend" },
    { id: "next-week", label: "Sljedeći tjedan" }
  ] as w}
    <a href={link({ when: w.id })}
       class="rounded-full border px-3 py-1.5 text-sm transition {when===w.id ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200' : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-600'}">
      {w.label}
    </a>
  {/each}
</div>

<!-- Category chips -->
<div class="mb-4 flex flex-wrap gap-2">
  {#each cats as c}
    <a href={link({ cat: cat===c.id ? '' : c.id })}
       class="rounded-full border px-3 py-1 text-xs transition {cat===c.id ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-600'}">
      {c.label}
    </a>
  {/each}
</div>
