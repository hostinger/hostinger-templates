<script setup lang="ts">
import type { Faq } from '~/types/site'

defineProps<{
  faqs: Faq[]
}>()
</script>

<template>
  <div class="faq-list">
    <details v-for="(faq, index) in faqs" :key="faq.question">
      <summary>
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        {{ faq.question }}
        <i aria-hidden="true" />
      </summary>
      <p>{{ faq.answer }}</p>
    </details>
  </div>
</template>
