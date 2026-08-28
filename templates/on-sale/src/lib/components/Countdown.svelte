<script lang="ts">
  import { onMount } from 'svelte'
  import { getCountdown, type CountdownParts } from '$lib/utils/countdown'

  let { targetDate }: { targetDate: string } = $props()
  let countdown = $state<CountdownParts | null>(null)

  onMount(() => {
    const update = () => {
      countdown = getCountdown(targetDate)
    }

    update()
    const timer = window.setInterval(update, 1_000)

    return () => window.clearInterval(timer)
  })

  const units = $derived(
    countdown
      ? [
          ['days', countdown.days],
          ['hours', countdown.hours],
          ['mins', countdown.minutes],
          ['secs', countdown.seconds],
        ]
      : [],
  )
</script>

<section class="countdown" aria-labelledby="countdown-heading">
  <div class="countdown__label">
    <span>Early-bird ink dries in</span>
    <span class="countdown__arrow" aria-hidden="true">→</span>
  </div>
  <div class="countdown__content">
    <h2 id="countdown-heading" class="sr-only">Early-bird ticket countdown</h2>
    {#if countdown?.complete}
      <p class="countdown__ended">Early-bird pricing has ended.</p>
    {:else if countdown}
      <div class="countdown__units" role="timer" aria-live="off" aria-atomic="true">
        {#each units as unit (unit[0])}
          <span class="countdown__unit">
            <strong>{String(unit[1]).padStart(2, '0')}</strong>
            <small>{unit[0]}</small>
          </span>
        {/each}
      </div>
      <p class="sr-only" aria-live="polite">
        {countdown.days} days, {countdown.hours} hours, {countdown.minutes} minutes remaining.
      </p>
    {:else}
      <p class="countdown__loading">Countdown starts when this page loads.</p>
    {/if}
  </div>
</section>
