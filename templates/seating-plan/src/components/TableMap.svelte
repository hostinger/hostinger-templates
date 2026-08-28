<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { LABELS } from '../content/copy';
  import { seatPositions } from '../lib/geometry';
  import { plan } from '../lib/plan.svelte';
  import type { TableSpec } from '../types';
  import SeatSpot from './SeatSpot.svelte';

  interface Props {
    table: TableSpec;
  }

  let { table }: Props = $props();

  // On narrow screens rectangular tables rotate to portrait so seats keep
  // comfortable spacing.
  const narrowScreen = new MediaQuery('(max-width: 32rem)');
  const portrait = $derived(table.shape === 'rect' && narrowScreen.current);

  const positions = $derived.by(() => {
    const base = seatPositions(table.shape, table.seatCount);
    return portrait ? base.map(({ x, y }) => ({ x: y, y: x })) : base;
  });

  const free = $derived(plan.freeSeats(table.id));
</script>

<section class="table-map" class:round={table.shape === 'round'} class:portrait aria-label={table.name}>
  <div class="canvas">
    {#if table.shape === 'round'}
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="27" fill="var(--table-fill)" stroke="var(--line)" stroke-width="1" />
        <circle cx="50" cy="50" r="22" fill="none" stroke="var(--line-soft)" stroke-width="0.6" stroke-dasharray="2.5 2.5" />
      </svg>
    {:else if portrait}
      <svg viewBox="0 0 200 300" aria-hidden="true">
        <rect x="58" y="66" width="84" height="168" rx="5" fill="var(--table-fill)" stroke="var(--line)" stroke-width="1.6" />
        <rect x="68" y="76" width="64" height="148" rx="3" fill="none" stroke="var(--line-soft)" stroke-width="1" stroke-dasharray="5 5" />
      </svg>
    {:else}
      <svg viewBox="0 0 300 200" aria-hidden="true">
        <rect x="66" y="58" width="168" height="84" rx="5" fill="var(--table-fill)" stroke="var(--line)" stroke-width="1.6" />
        <rect x="76" y="68" width="148" height="64" rx="3" fill="none" stroke="var(--line-soft)" stroke-width="1" stroke-dasharray="5 5" />
      </svg>
    {/if}
    <div class="table-label">
      <h3>{table.name}</h3>
      <p class="free" class:full={free === 0}>
        {free}
        {free === 1 ? LABELS.freeSeatsOne : LABELS.freeSeatsMany}
      </p>
    </div>
    {#each positions as position, seatIndex (seatIndex)}
      <SeatSpot {table} {seatIndex} {position} />
    {/each}
  </div>
</section>

<style>
  .table-map {
    width: 100%;
    max-width: 30rem;
  }

  .table-map.round {
    max-width: 24rem;
  }

  .table-map.portrait {
    max-width: 19rem;
  }

  .canvas {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 2;
  }

  .round .canvas {
    aspect-ratio: 1 / 1;
  }

  .portrait .canvas {
    aspect-ratio: 2 / 3;
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .table-label {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
  }

  h3 {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink);
  }

  .portrait h3 {
    font-size: 0.7rem;
    letter-spacing: 0.1em;
  }

  .free {
    margin: 0.25rem 0 0;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    color: var(--accent);
  }

  .free.full {
    color: var(--ink-dim);
  }
</style>
