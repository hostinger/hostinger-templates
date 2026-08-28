<script lang="ts">
  import HowTo from './components/HowTo.svelte';
  import Roster from './components/Roster.svelte';
  import TableMap from './components/TableMap.svelte';
  import TitleBlock from './components/TitleBlock.svelte';
  import Toolbar from './components/Toolbar.svelte';
  import { LABELS, SITE } from './content/copy';
  import { TABLES } from './content/tables';
</script>

<div class="sheet">
  <header class="masthead">
    <div class="heading">
      <p class="eyebrow">{SITE.eyebrow}</p>
      <h1>{SITE.title}</h1>
      <p class="tagline">{SITE.tagline}</p>
    </div>
    <TitleBlock />
  </header>

  <Toolbar />

  <main class="plan-grid">
    <Roster />
    <section class="floor" aria-label={LABELS.floorTitle}>
      {#each TABLES as table (table.id)}
        <TableMap {table} />
      {/each}
    </section>
  </main>

  <HowTo />

  <footer class="colophon">
    <p>{SITE.footnote}</p>
  </footer>
</div>

<style>
  .sheet {
    max-width: 75rem;
    margin: clamp(0.75rem, 2.5vw, 2rem) auto;
    padding: clamp(1rem, 3vw, 2.5rem);
    border: 1.5px solid var(--line);
    outline: 1px solid var(--line-soft);
    outline-offset: -8px;
  }

  .masthead {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .heading {
    min-width: 0;
  }

  .eyebrow {
    margin: 0 0 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent);
  }

  h1 {
    margin: 0;
    font-family: var(--font-mono);
    font-size: clamp(1.4rem, 4vw, 2.2rem);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink);
  }

  .tagline {
    margin: 0.6rem 0 0;
    max-width: 34rem;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--ink-dim);
  }

  .plan-grid {
    display: grid;
    grid-template-columns: minmax(15rem, 19rem) 1fr;
    gap: 2rem;
    margin-top: 1.75rem;
    align-items: start;
  }

  .floor {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem 2rem;
  }

  .colophon {
    margin-top: 2.5rem;
    border-top: 1px solid var(--line-soft);
    padding-top: 1rem;
  }

  .colophon p {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.05em;
    line-height: 1.6;
    color: var(--ink-dim);
  }

  @media (max-width: 56rem) {
    .plan-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>
