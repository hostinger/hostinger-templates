<script setup lang="ts">
import site from '../data/site.json';

defineProps<{
  faqs: Array<{ question: string; answer: string }>;
}>();
</script>

<template>
  <section
    id="faq"
    class="faq section-pad"
  >
    <div class="section-kicker">
      Questions, unpacked
    </div>
    <div class="faq-layout">
      <div class="faq-heading">
        <h2>Good to know<br><em>before the big day.</em></h2>
        <p>Still wondering about something?</p>
        <a :href="`mailto:${site.email}`">Ask us a question ↗</a>
      </div>
      <div class="faq-list">
        <details
          v-for="(faq, index) in faqs"
          :key="faq.question"
          :open="index === 0"
        >
          <summary><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ faq.question }}<i>+</i></summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
