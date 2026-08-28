<script lang="ts">
  import { plan } from '../lib/plan.svelte';
  import type { Guest } from '../types';

  interface Props {
    guest: Guest;
  }

  let { guest }: Props = $props();

  const selected = $derived(plan.selectedGuestId === guest.id);

  function onDragStart(event: DragEvent) {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData('text/plain', guest.id);
    event.dataTransfer.effectAllowed = 'move';
  }
</script>

<button
  type="button"
  class="chip"
  class:selected
  draggable="true"
  aria-pressed={selected}
  ondragstart={onDragStart}
  onclick={() => plan.toggleSelect(guest.id)}
>
  <span class="grip" aria-hidden="true">⠿</span>
  {guest.name}
</button>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.8rem;
    border: 1px solid var(--line-soft);
    border-radius: 999px;
    background: var(--paper-raised);
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    letter-spacing: 0.02em;
    cursor: grab;
    touch-action: manipulation;
    transition:
      border-color 120ms ease,
      background-color 120ms ease,
      color 120ms ease;
  }

  .chip:hover {
    border-color: var(--line);
  }

  .chip:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .chip.selected {
    background: var(--select);
    border-color: var(--select);
    color: var(--paper-deep);
    cursor: grabbing;
  }

  .grip {
    color: var(--ink-dim);
    font-size: 0.7rem;
  }

  .chip.selected .grip {
    color: var(--paper-deep);
  }
</style>
