<script setup lang="ts">
import site from '~/data/site.json'
import { getBookingHref } from '~/utils/contact'

const bookingHref = getBookingHref(site.bookingUrl, site.email)

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: site.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }),
    },
  ],
})
</script>

<template>
  <div id="top">
    <SiteHeader
      :name="site.name"
      :navigation="site.navigation"
      :booking-href="bookingHref"
      :booking-label="site.labels.booking"
      :back-to-top-label="site.labels.backToTop"
      :navigation-label="site.labels.mainNavigation"
    />

    <main>
      <section class="hero ruled-section">
        <div class="hero-copy">
          <p class="eyebrow">{{ site.eyebrow }}</p>
          <h1>{{ site.headline }}</h1>
          <p class="hero-intro">{{ site.intro }}</p>
          <div class="hero-actions">
            <a class="button" :href="bookingHref">{{ site.labels.booking }} <span aria-hidden="true">↗</span></a>
            <span>{{ site.location }}</span>
          </div>
        </div>
        <aside class="hero-margin">
          <div class="availability">{{ site.availability }}</div>
          <svg class="hero-doodle" viewBox="0 0 340 390" aria-label="A hand-drawn path from a tangled problem to a clear direction">
            <path class="doodle-loop" d="M27 75c77-91 169 83 63 92-94 8-61-137 43-86 116 58-64 169-87 66-20-91 215-97 241-6" />
            <path class="doodle-line" d="M285 139c-15 58-49 105-94 143-30 25-67 42-109 50" />
            <path class="doodle-arrow" d="m98 307-18 26 31-1" />
            <text x="186" y="302">the useful edge</text>
          </svg>
          <span class="margin-note">Start where the<br>energy is stuck.</span>
        </aside>
      </section>

      <section class="proof-strip" aria-label="Client testimonial">
        <blockquote>“{{ site.proof.quote }}”</blockquote>
        <cite>{{ site.proof.attribution }}</cite>
      </section>

      <section id="services" class="services ruled-section">
        <div class="section-heading">
          <p class="eyebrow">{{ site.labels.servicesEyebrow }}</p>
          <h2>From stuck<br>to moving.</h2>
          <p>{{ site.servicesIntro }}</p>
          <svg viewBox="0 0 170 85" aria-hidden="true">
            <path d="M5 18c44 8 80 27 143 22" />
            <path d="m132 27 18 13-18 14" />
          </svg>
        </div>
        <div class="outcomes">
          <OutcomeNote
            v-for="(service, index) in site.services"
            :key="service.title"
            :service="service"
            :index="index"
          />
        </div>
      </section>

      <section id="approach" class="approach">
        <div>
          <p class="eyebrow">{{ site.approach.eyebrow }}</p>
          <h2>{{ site.approach.title }}</h2>
        </div>
        <div class="approach-copy">
          <p>{{ site.approach.body }}</p>
          <ProcessDiagram :steps="site.approach.steps" />
        </div>
      </section>

      <section id="faq" class="faq ruled-section">
        <div class="section-heading">
          <p class="eyebrow">{{ site.labels.faqEyebrow }}</p>
          <h2>{{ site.faqTitle }}</h2>
          <p class="red-note">{{ site.labels.faqNote }}</p>
        </div>
        <FaqList :faqs="site.faqs" />
      </section>

      <section class="closing">
        <p class="eyebrow">{{ site.closing.eyebrow }}</p>
        <h2>{{ site.closing.title }}</h2>
        <p>{{ site.closing.body }}</p>
        <a class="button button--light" :href="bookingHref">{{ site.labels.booking }} <span aria-hidden="true">↗</span></a>
        <svg viewBox="0 0 300 90" aria-hidden="true">
          <path d="M14 71c55-61 128-73 250-37" />
          <path d="m245 18 21 16-28 8" />
        </svg>
      </section>
    </main>

    <footer>
      <strong>{{ site.name }}</strong>
      <span>{{ site.footerNote }}</span>
      <a :href="`mailto:${site.email}`">{{ site.email }}</a>
    </footer>
  </div>
</template>
