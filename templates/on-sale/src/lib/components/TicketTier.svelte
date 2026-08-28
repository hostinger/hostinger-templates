<script lang="ts">
  import type { EventDetails, TicketTier as TicketTierType } from '$lib/types/event'
  import { formatPrice, getTicketHref } from '$lib/utils/tickets'

  let {
    tier,
    event,
    index,
  }: { tier: TicketTierType; event: EventDetails; index: number } = $props()

  const href = $derived(getTicketHref(tier, event))
  const isExternal = $derived(Boolean(tier.ticketUrl))
</script>

<article class="ticket" aria-labelledby={`tier-${tier.id}`}>
  <div class="ticket__number" aria-hidden="true">0{index + 1}</div>
  <div class="ticket__main">
    <div class="ticket__heading">
      <div>
        <p class="ticket__remaining">Only {tier.remaining} left</p>
        <h3 id={`tier-${tier.id}`}>{tier.name}</h3>
      </div>
      <p class="ticket__price">{formatPrice(tier)}</p>
    </div>
    <p class="ticket__description">{tier.description}</p>
    <ul class="ticket__perks" aria-label={`${tier.name} includes`}>
      {#each tier.perks as perk (perk)}
        <li>{perk}</li>
      {/each}
    </ul>
  </div>
  <div class="ticket__action">
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>
      {isExternal ? 'Buy ticket' : 'Ask to book'}
      <span aria-hidden="true">↗</span>
    </a>
    <span>{isExternal ? 'Online checkout' : 'Opens email'}</span>
  </div>
</article>
