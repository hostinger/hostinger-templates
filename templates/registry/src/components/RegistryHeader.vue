<script setup lang="ts">
import { site } from '../content/site';
import BowMotif from './motifs/BowMotif.vue';
</script>

<template>
  <header class="registry-header">
    <BowMotif class="registry-header__motif" />
    <p class="registry-header__eyebrow">
      {{ site.eyebrow }}
    </p>
    <h1 class="registry-header__names">
      {{ site.coupleNames }}
    </h1>
    <p class="registry-header__event">
      {{ site.eventLine }}
    </p>
    <p class="registry-header__intro">
      {{ site.intro }}
    </p>
  </header>
</template>
