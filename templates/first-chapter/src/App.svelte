<script lang="ts">
  import { tick } from 'svelte';
  import Landing from './components/Landing.svelte';
  import Reader from './components/Reader.svelte';
  import { site } from './lib/site';

  const READER_HASH = '#read';

  let isReading = $state(window.location.hash === READER_HASH);

  const pageTitle = $derived(
    isReading
      ? `${site.reader.chapterLabel} · ${site.book.title}`
      : `${site.book.title} — ${site.book.coverSubtitle.toLowerCase()} by ${site.book.author}`,
  );

  async function handleHashChange(): Promise<void> {
    isReading = window.location.hash === READER_HASH;
    await tick();
    if (isReading) return;
    const id = window.location.hash.slice(1);
    const target = id === '' ? null : document.getElementById(id);
    if (target !== null) {
      target.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }
</script>

<svelte:window onhashchange={handleHashChange} />

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

{#if isReading}
  <Reader />
{:else}
  <Landing />
{/if}
