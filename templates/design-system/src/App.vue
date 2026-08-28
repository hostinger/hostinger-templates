<script setup lang="ts">
import { RouterView } from 'vue-router';
import SiteFooter from './components/SiteFooter.vue';
import SiteHeader from './components/SiteHeader.vue';
import { site } from './utils/content';
</script>

<template>
  <a class="skip-link" href="#main">{{ site.skipLinkLabel }}</a>
  <SiteHeader />
  <main id="main" class="site-main">
    <RouterView />
  </main>
  <SiteFooter />
</template>
