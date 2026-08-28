<script lang="ts">
  import Countdown from '$lib/components/Countdown.svelte'
  import EventHero from '$lib/components/EventHero.svelte'
  import FaqList from '$lib/components/FaqList.svelte'
  import TicketList from '$lib/components/TicketList.svelte'
  import eventData from '$lib/content/event.json'
  import type { EventDetails } from '$lib/types/event'

  const event = eventData as EventDetails
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.venue.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.venue.address,
        addressLocality: event.venue.city,
        addressCountry: 'GB',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer,
      email: event.contactEmail,
    },
    offers: event.ticketTiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      price: tier.price,
      priceCurrency: tier.currency,
      availability: tier.remaining > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      url: tier.ticketUrl ?? `mailto:${event.contactEmail}`,
    })),
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: event.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
  const structuredData = [eventJsonLd, faqJsonLd]
    .map((value) => `<script type="application/ld+json">${JSON.stringify(value)}<${'/'}script>`)
    .join('')
</script>

<svelte:head>
  <title>{event.name} — Screen-print workshop & poster show</title>
  <meta name="description" content={event.description} />
  <meta name="theme-color" content="#f7f0df" />
  <!-- Trusted JSON generated only from the committed event content file. -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html structuredData}
</svelte:head>

<main>
  <EventHero {event} />
  <Countdown targetDate={event.earlyBirdEndsAt} />
  <TicketList {event} />

  <section class="manifesto" aria-label="Workshop manifesto">
    <p>Pull it.</p>
    <p>Flood it.</p>
    <p>Print it.</p>
    <span>Make a mess worth keeping.</span>
  </section>

  <FaqList items={event.faq} />
</main>

<footer>
  <span class="footer__mark">ON//SALE</span>
  <address>
    {event.venue.name}<br />
    {event.venue.address}<br />
    {event.venue.city}
  </address>
  <div class="footer__contact">
    <span>Questions / access needs?</span>
    <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
  </div>
  <p>© 2026 {event.organizer}</p>
</footer>
