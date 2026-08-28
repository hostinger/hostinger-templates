<script setup lang="ts">
import site from '../data/site.json';
</script>

<template>
  <header class="site-header">
    <a
      class="brand"
      href="#"
      :aria-label="`${site.name} home`"
    >
      <span
        class="brand-mark"
        aria-hidden="true"
      ><i /><i /><i /></span>
      <span>{{ site.name }}</span>
    </a>
    <nav aria-label="Main navigation">
      <a href="#estimate">Get an estimate</a>
      <a href="#how-it-works">How it works</a>
      <a href="#faq">FAQs</a>
    </nav>
    <a
      class="phone-link"
      :href="site.phoneHref"
    >
      <span aria-hidden="true">↗</span>
      {{ site.phoneDisplay }}
    </a>
  </header>
</template>
