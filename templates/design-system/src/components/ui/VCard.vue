<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    padding?: 'sm' | 'md' | 'lg';
    elevated?: boolean;
  }>(),
  {
    title: '',
    padding: 'md',
    elevated: false,
  },
);
</script>

<template>
  <article
    class="v-card"
    :class="[`v-card--pad-${padding}`, { 'v-card--elevated': elevated }]"
  >
    <header v-if="title !== ''" class="v-card__header">
      <h3 class="v-card__title">{{ title }}</h3>
    </header>
    <div class="v-card__body">
      <slot />
    </div>
  </article>
</template>

<style>
.v-card {
  --v-card-pad: 20px;
  width: 100%;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
  font-family: var(--font-sans);
  text-align: left;
  transition: box-shadow 130ms ease;
}

.v-card--pad-sm {
  --v-card-pad: 14px;
}

.v-card--pad-md {
  --v-card-pad: 20px;
}

.v-card--pad-lg {
  --v-card-pad: 28px;
}

.v-card--elevated {
  box-shadow: var(--shadow);
}

.v-card__header {
  padding: calc(var(--v-card-pad) * 0.75) var(--v-card-pad);
  border-bottom: 1px solid var(--line);
}

.v-card__title {
  margin: 0;
  font-size: 15.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--ink);
}

.v-card__body {
  padding: var(--v-card-pad);
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--ink-soft);
}
</style>
