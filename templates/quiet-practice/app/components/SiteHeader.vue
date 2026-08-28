<script setup lang="ts">
import { site } from '~/data/content'
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink to="/" class="wordmark">
        <ArtMark class="wordmark__mark" />
        <span class="wordmark__text">
          <span class="wordmark__name">{{ site.name }}</span>
          <span class="wordmark__descriptor">{{ site.descriptor }}</span>
        </span>
      </NuxtLink>
      <nav class="site-nav" aria-label="Main">
        <NuxtLink
          v-for="link in site.navigation"
          :key="link.href"
          :to="link.href"
          class="site-nav__link"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
