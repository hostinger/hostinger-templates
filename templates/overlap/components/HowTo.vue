<script setup lang="ts">
import { HOW_TO } from '~/constants/copy'
</script>

<template>
  <section
    class="howto"
    aria-labelledby="howto-title"
  >
    <h2
      id="howto-title"
      class="howto-title"
    >
      {{ HOW_TO.title }}
    </h2>
    <div class="howto-grid">
      <article
        v-for="item in HOW_TO.items"
        :key="item.question"
        class="howto-card"
      >
        <h3 class="howto-question">
          {{ item.question }}
        </h3>
        <p class="howto-answer">
          {{ item.answer }}
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.howto-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.howto-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.howto-card {
  padding: 1.1rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-m);
  background: linear-gradient(160deg, var(--color-surface), var(--color-bg-deep));
}

.howto-question {
  margin-bottom: 0.45rem;
  font-size: 0.98rem;
  font-weight: 700;
}

.howto-question::before {
  content: '';
  display: block;
  width: 2rem;
  height: 3px;
  margin-bottom: 0.65rem;
  border-radius: 3px;
  background: var(--gradient-aurora);
}

.howto-answer {
  color: var(--color-ink-dim);
  font-size: 0.88rem;
}

@media (max-width: 760px) {
  .howto-grid {
    grid-template-columns: 1fr;
  }
}
</style>
