<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <div>
    <a class="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">
      <NuxtPage />
    </main>
    <SiteFooter :site="site" />
  </div>
</template>
