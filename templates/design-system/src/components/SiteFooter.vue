<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { components, site } from '../utils/content';
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        <p class="wordmark wordmark--inverse">
          <span class="wordmark__glyph" aria-hidden="true"></span>
          <span class="wordmark__name">{{ site.systemName }}</span>
        </p>
        <p class="site-footer__line">{{ site.footer.line }}</p>
      </div>
      <nav class="site-footer__nav" :aria-label="site.footer.navAriaLabel">
        <RouterLink
          v-for="doc in components"
          :key="doc.id"
          class="site-footer__link"
          :to="`/components/${doc.id}`"
        >
          {{ doc.name }}
        </RouterLink>
        <RouterLink
          class="site-footer__link"
          :to="{ path: '/', hash: '#faq' }"
        >
          {{ site.nav.faqLabel }}
        </RouterLink>
      </nav>
    </div>
    <div class="container site-footer__meta">
      <p>{{ site.footer.editNote }}</p>
      <p class="site-footer__stamp">
        v{{ site.version }} · {{ site.packageName }}
      </p>
    </div>
  </footer>
</template>
