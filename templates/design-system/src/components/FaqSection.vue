<script setup lang="ts">
import { computed } from 'vue';
import { site } from '../utils/content';

const jsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: site.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }),
);
</script>

<template>
  <section id="faq" class="faq" aria-labelledby="faq-heading">
    <div class="container faq__inner">
      <header class="section-head">
        <p class="kicker">{{ site.faq.kicker }}</p>
        <h2 id="faq-heading">{{ site.faq.heading }}</h2>
      </header>
      <div class="faq__list">
        <details
          v-for="(item, index) in site.faq.items"
          :key="item.question"
          class="faq__item"
          :open="index === 0"
        >
          <summary>
            <span>{{ item.question }}</span>
            <span class="faq__marker" aria-hidden="true"></span>
          </summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </div>
    <component :is="'script'" type="application/ld+json">{{ jsonLd }}</component>
  </section>
</template>
