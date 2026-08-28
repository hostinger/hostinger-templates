<script setup lang="ts">
import { site } from '~/data/content'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': site.faq.items.map(faq => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer,
    },
  })),
}

useHead({
  title: `${site.name} — ${site.descriptor}, ${site.location}`,
  meta: [{ name: 'description', content: site.hero.lead }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqSchema),
    },
  ],
})
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__copy">
          <p class="eyebrow">{{ site.hero.eyebrow }}</p>
          <h1 class="hero__heading">{{ site.hero.heading }}</h1>
          <p class="hero__lead">{{ site.hero.lead }}</p>
          <div class="hero__actions">
            <a href="#self-check" class="btn">{{ site.hero.primaryCta }}</a>
            <a href="#services" class="btn btn--quiet">{{ site.hero.secondaryCta }}</a>
          </div>
        </div>
        <div class="hero__art">
          <ArtRipples />
        </div>
      </div>
      <div class="container">
        <ul class="hero__facts">
          <li v-for="fact in site.facts" :key="fact">{{ fact }}</li>
        </ul>
      </div>
    </section>

    <SelfCheckPanel />
    <ServiceIndex />
    <PathSteps />
    <FaqSection />
    <ContactPanel />
  </div>
</template>
