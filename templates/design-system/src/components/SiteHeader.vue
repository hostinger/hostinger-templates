<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { components, site } from '../utils/content';
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <RouterLink class="wordmark" to="/">
        <span class="wordmark__glyph" aria-hidden="true"></span>
        <span class="wordmark__name">{{ site.systemName }}</span>
        <span class="wordmark__version">v{{ site.version }}</span>
      </RouterLink>
      <nav class="site-nav" :aria-label="site.nav.ariaLabel">
        <RouterLink
          v-for="doc in components"
          :key="doc.id"
          class="site-nav__link"
          :to="`/components/${doc.id}`"
        >
          {{ doc.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
