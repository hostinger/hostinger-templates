<script setup lang="ts">
import type { NavigationItem } from '~/types/site'

defineProps<{
  name: string
  navigation: NavigationItem[]
  bookingHref: string
  bookingLabel: string
  backToTopLabel: string
  navigationLabel: string
}>()
</script>

<template>
  <header class="site-header">
    <a class="wordmark" href="#top" :aria-label="backToTopLabel">
      {{ name }}
      <span>MB</span>
    </a>
    <nav :aria-label="navigationLabel">
      <a v-for="item in navigation" :key="item.href" :href="item.href">
        {{ item.label }}
      </a>
    </nav>
    <a class="button button--small" :href="bookingHref">{{ bookingLabel }} <span aria-hidden="true">↗</span></a>
  </header>
</template>
