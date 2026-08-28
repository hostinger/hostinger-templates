<script setup lang="ts">
import giftsData from './content/gifts.json';
import type { Gift } from './types';
import { useClaims } from './composables/useClaims';
import RegistryHeader from './components/RegistryHeader.vue';
import ClaimSummary from './components/ClaimSummary.vue';
import GiftList from './components/GiftList.vue';
import FaqSection from './components/FaqSection.vue';
import SiteFooter from './components/SiteFooter.vue';

const gifts = giftsData as Gift[];
const { availableCount, claim, isClaimed, isDeviceClaimed, release } = useClaims(gifts);
</script>

<template>
  <main class="page">
    <RegistryHeader />
    <section
      class="registry"
      aria-labelledby="registry-heading"
    >
      <ClaimSummary
        :available-count="availableCount"
        :total-count="gifts.length"
      />
      <GiftList
        :gifts="gifts"
        :is-claimed="isClaimed"
        :is-device-claimed="isDeviceClaimed"
        @claim="claim"
        @release="release"
      />
    </section>
    <FaqSection />
    <SiteFooter />
  </main>
</template>
