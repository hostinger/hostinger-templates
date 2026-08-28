<script lang="ts">
  import { LABELS } from '../content/copy';
  import { plan } from '../lib/plan.svelte';
  import type { SeatPosition, TableSpec } from '../types';

  interface Props {
    table: TableSpec;
    seatIndex: number;
    position: SeatPosition;
  }

  let { table, seatIndex, position }: Props = $props();

  const guest = $derived(plan.guestAt(table.id, seatIndex));
  const seatLabel = $derived(`Seat ${seatIndex + 1} of ${table.seatCount} at ${table.name}`);
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
    if (guestId) plan.assign(guestId, table.id, seatIndex);
  }

  function onEmptySeatClick() {
    if (plan.selectedGuestId) plan.assign(plan.selectedGuestId, table.id, seatIndex);
  }

  function onOccupantClick() {
    if (!guest) return;
    if (plan.selectedGuestId && plan.selectedGuestId !== guest.id) {
      plan.assign(plan.selectedGuestId, table.id, seatIndex);
    } else {
      plan.toggleSelect(guest.id);
    }
  }

  function onOccupantDragStart(event: DragEvent) {
    if (!guest || !event.dataTransfer) return;
    event.dataTransfer.setData('text/plain', guest.id);
    event.dataTransfer.effectAllowed = 'move';
  }
</script>

<div class="spot" style={`left:${position.x}%; top:${position.y}%`}>
  {#if guest}
    <div
      class="seat occupied"
      class:drag-over={dragOver}
      role="group"
      aria-label={`${seatLabel} — ${guest.name}`}
      ondragover={onDragOver}
      ondragleave={onDragLeave}
      ondrop={onDrop}
    >
      <button
        type="button"
        class="occupant"
        class:selected={plan.selectedGuestId === guest.id}
        draggable="true"
        aria-pressed={plan.selectedGuestId === guest.id}
        aria-label={`${guest.name}, ${seatLabel}. Activate to select, then pick another seat to move.`}
        ondragstart={onOccupantDragStart}
        onclick={onOccupantClick}
      >
        {guest.name}
      </button>
      <button
        type="button"
        class="remove"
        aria-label={`Return ${guest.name} to the guest list`}
        onclick={() => plan.unassign(guest.id)}
      >
        ×
      </button>
    </div>
  {:else}
    <button
      type="button"
      class="seat empty"
      class:drag-over={dragOver}
      class:target={plan.selectedGuestId !== null}
      aria-label={`${seatLabel} — ${LABELS.emptySeat}`}
      ondragover={onDragOver}
      ondragleave={onDragLeave}
      ondrop={onDrop}
      onclick={onEmptySeatClick}
    >
      <span aria-hidden="true">{LABELS.emptySeat}</span>
    </button>
  {/if}
</div>

<style>
  .spot {
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .seat {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--seat-size);
    height: var(--seat-size);
    border-radius: 50%;
    box-sizing: border-box;
    font-family: var(--font-mono);
    text-align: center;
  }

  .seat.empty {
    border: 1.5px dashed var(--line-soft);
    background: transparent;
    color: var(--ink-dim);
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      border-color 120ms ease,
      background-color 120ms ease;
  }

  .seat.empty:hover,
  .seat.empty.target {
    border-color: var(--accent);
    color: var(--accent);
  }

  .seat.empty:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }

  .seat.drag-over {
    background: var(--accent-soft);
    border-color: var(--accent);
  }

  .seat.occupied {
    position: relative;
    border: 1.5px solid var(--line);
    background: var(--paper-raised);
  }

  .occupant {
    width: 100%;
    height: 100%;
    padding: 0.2rem;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 0.58rem;
    line-height: 1.25;
    overflow-wrap: anywhere;
    cursor: grab;
    touch-action: manipulation;
  }

  .occupant:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }

  .occupant.selected {
    background: var(--select);
    color: var(--paper-deep);
  }

  .remove {
    position: absolute;
    top: -0.45rem;
    right: -0.45rem;
    width: 1.3rem;
    height: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: var(--paper-deep);
    color: var(--ink);
    font-size: 0.85rem;
    line-height: 1;
    cursor: pointer;
  }

  .remove:hover {
    border-color: var(--select);
    color: var(--select);
  }

  .remove:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @media (max-width: 30rem) {
    .seat.empty,
    .occupant {
      font-size: 0.5rem;
    }

    .remove {
      width: 2rem;
      height: 2rem;
      top: -0.65rem;
      right: -0.65rem;
    }
  }
</style>
