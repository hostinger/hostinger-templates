<script setup lang="ts">
import { site } from '../content/site';
import SprigMotif from './motifs/SprigMotif.vue';
</script>

<template>
  <footer class="site-footer">
    <SprigMotif class="site-footer__motif" />
    <p class="site-footer__signoff">
      {{ site.footerSignoff }}
    </p>
    <p class="site-footer__note">
      {{ site.footerNote }}
    </p>
  </footer>
</template>
