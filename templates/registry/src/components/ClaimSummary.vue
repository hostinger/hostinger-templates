<script setup lang="ts">
import { site } from '../content/site';
import RibbonMotif from './motifs/RibbonMotif.vue';

defineProps<{
  availableCount: number;
  totalCount: number;
}>();
</script>

<template>
  <div class="claim-summary">
    <RibbonMotif class="claim-summary__ribbon" />
    <h2
      id="registry-heading"
      class="claim-summary__heading"
    >
      {{ site.summaryHeading }}
    </h2>
    <p
      class="claim-summary__count"
      aria-live="polite"
    >
      <strong>{{ availableCount }} of {{ totalCount }}</strong> gifts still available
    </p>
    <p class="claim-summary__note">
      {{ site.deviceNote }}
    </p>
  </div>
</template>
