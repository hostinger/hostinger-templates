<script lang="ts">
  import { LABELS } from '../content/copy';
  import { plan } from '../lib/plan.svelte';
  import GuestChip from './GuestChip.svelte';

  let dragOver = $state(false);

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    dragOver = true;
  }

  function onDragLeave() {
    dragOver = false;
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
    const guestId = event.dataTransfer?.getData('text/plain');
    if (guestId) plan.unassign(guestId);
  }
</script>

<aside
  class="roster"
  class:drag-over={dragOver}
  aria-label={LABELS.rosterTitle}
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
>
  <h2>{LABELS.rosterTitle}</h2>
  <p class="hint">{LABELS.rosterHint}</p>
  {#if plan.unassignedGuests.length === 0}
    <p class="all-seated">{LABELS.rosterEmpty}</p>
  {:else}
    <ul>
      {#each plan.unassignedGuests as guest (guest.id)}
        <li><GuestChip {guest} /></li>
      {/each}
    </ul>
  {/if}
  <p class="drop-hint">{LABELS.rosterDropHint}</p>
</aside>

<style>
  .roster {
    border: 1px solid var(--line-soft);
    padding: 1.1rem 1.2rem 1.2rem;
    background: var(--paper-inset);
    transition: border-color 120ms ease;
  }

  .roster.drag-over {
    border-color: var(--accent);
  }

  h2 {
    margin: 0 0 0.35rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink);
  }

  .hint {
    margin: 0 0 0.9rem;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--ink-dim);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .all-seated {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--accent);
  }

  .drop-hint {
    margin: 1rem 0 0;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-dim);
  }
</style>
