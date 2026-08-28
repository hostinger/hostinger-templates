<script setup lang="ts">
import { site } from '../content/site';
import SprigMotif from './motifs/SprigMotif.vue';
</script>

<template>
  <section
    class="faq"
    aria-labelledby="faq-heading"
  >
    <SprigMotif class="faq__motif" />
    <h2
      id="faq-heading"
      class="faq__heading"
    >
      {{ site.faqHeading }}
    </h2>
    <p class="faq__intro">
      {{ site.faqIntro }}
    </p>
    <div class="faq__list">
      <details
        v-for="item in site.faq"
        :key="item.question"
        class="faq__item"
      >
        <summary class="faq__question">
          {{ item.question }}
        </summary>
        <p class="faq__answer">
          {{ item.answer }}
        </p>
      </details>
    </div>
  </section>
</template>
