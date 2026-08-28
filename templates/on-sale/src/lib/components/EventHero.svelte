<script lang="ts">
  import { resolve } from '$app/paths'
  import type { EventDetails } from '$lib/types/event'

  let { event }: { event: EventDetails } = $props()

  const eventDate = $derived(new Date(event.startDate))
  const day = $derived(eventDate.toLocaleDateString('en-GB', { day: '2-digit' }))
  const month = $derived(eventDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase())
  const weekday = $derived(eventDate.toLocaleDateString('en-GB', { weekday: 'long' }))
  const time = $derived(
    eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  )
</script>

<header class="hero">
  <nav class="hero__nav" aria-label="Main navigation">
    <a class="wordmark" href={resolve('/')} aria-label="{event.name} home">ON//SALE</a>
    <a class="nav-ticket" href="#tickets">Get tickets <span aria-hidden="true">↘</span></a>
  </nav>

  <div class="hero__grid">
    <div class="hero__date" aria-label={`${weekday}, ${day} ${month}`}>
      <span>{day}</span>
      <span>{month}</span>
    </div>

    <div class="hero__copy">
      <p class="kicker">{event.eyebrow}</p>
      <h1>
        <span>PRINT</span>
        <span>LOUD</span>
      </h1>
      <p class="hero__description">{event.description}</p>
    </div>
  </div>

  <div class="hero__details" aria-label="Event details">
    <p><strong>{weekday}</strong> / {time}</p>
    <p><strong>{event.venue.name}</strong> / {event.venue.city}</p>
    <a href="#tickets">Choose your pass <span aria-hidden="true">↓</span></a>
  </div>
</header>
