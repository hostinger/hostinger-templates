<script lang="ts">
  import TicketTier from '$lib/components/TicketTier.svelte'
  import type { EventDetails } from '$lib/types/event'

  let { event }: { event: EventDetails } = $props()
</script>

<section class="tickets" id="tickets" aria-labelledby="tickets-heading">
  <div class="section-heading">
    <p>Pick your pressure</p>
    <h2 id="tickets-heading">TICKETS<span>!</span></h2>
  </div>

  <div class="tickets__list">
    {#each event.ticketTiers as tier, index (tier.id)}
      <TicketTier {tier} {event} {index} />
    {/each}
  </div>

  <p class="tickets__disclaimer">
    <strong>Small print, printed big:</strong> {event.ticketDisclaimer}
  </p>
</section>
