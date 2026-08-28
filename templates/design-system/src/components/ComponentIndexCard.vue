<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { ComponentDoc } from '../types/content';
import { site } from '../utils/content';

defineProps<{ doc: ComponentDoc }>();
</script>

<template>
  <article class="index-card">
    <div class="index-card__top">
      <p class="index-card__kicker">{{ doc.kicker }}</p>
      <code class="index-card__tag">&lt;{{ doc.tag }}&gt;</code>
    </div>
    <h3 class="index-card__name">
      <RouterLink class="index-card__link" :to="`/components/${doc.id}`">
        {{ doc.name }}
      </RouterLink>
    </h3>
    <p class="index-card__summary">{{ doc.summary }}</p>
    <ul class="index-card__props" :aria-label="site.componentIndex.propsAriaLabel">
      <li v-for="prop in doc.props" :key="prop.name">
        <code>{{ prop.name }}</code>
      </li>
    </ul>
    <span class="index-card__cta" aria-hidden="true">
      {{ site.componentIndex.openLabel }}
      <span class="index-card__arrow">→</span>
    </span>
  </article>
</template>
