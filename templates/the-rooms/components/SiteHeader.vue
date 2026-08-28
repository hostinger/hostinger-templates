<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <header class="site-header">
    <NuxtLink class="wordmark" to="/" aria-label="The Rooms, home">
      <span class="wordmark__main">THE ROOMS</span>
      <span class="wordmark__place">{{ site.location }}</span>
    </NuxtLink>
    <nav aria-label="Main navigation">
      <NuxtLink to="/#rooms">Rooms</NuxtLink>
      <NuxtLink to="/#rates">Rates</NuxtLink>
      <NuxtLink to="/#find-us">Find us</NuxtLink>
    </nav>
  </header>
</template>
