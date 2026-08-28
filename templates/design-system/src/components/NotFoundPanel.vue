<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { site } from '../utils/content';

defineProps<{ message: string }>();
</script>

<template>
  <section class="not-found">
    <div class="container not-found__inner">
      <p class="kicker">404</p>
      <h1>{{ site.notFound.title }}</h1>
      <p class="not-found__message">{{ message }}</p>
      <div class="not-found__actions">
        <RouterLink class="cta cta--primary" to="/">
          {{ site.notFound.homeLabel }}
        </RouterLink>
        <RouterLink
          class="cta cta--ghost"
          :to="{ path: '/', hash: '#components' }"
        >
          {{ site.notFound.browseLabel }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>
