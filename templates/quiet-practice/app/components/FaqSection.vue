<script setup lang="ts">
import { site } from '~/data/content'
</script>

<template>
  <section
    id="faq"
    class="faq"
    aria-labelledby="faq-title"
  >
    <div class="container faq__inner">
      <p class="eyebrow">{{ site.faq.eyebrow }}</p>
      <h2 id="faq-title">{{ site.faq.title }}</h2>
      <div class="faq__list">
        <details
          v-for="(faq, index) in site.faq.items"
          :key="faq.question"
          class="faq__item"
          :open="index === 0"
        >
          <summary>
            <span>{{ faq.question }}</span>
            <span class="faq__marker" aria-hidden="true" />
          </summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
