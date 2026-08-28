<script setup lang="ts">
import type { Gift } from '../types';
import GiftCard from './GiftCard.vue';

defineProps<{
  gifts: Gift[];
  isClaimed: (gift: Gift) => boolean;
  isDeviceClaimed: (gift: Gift) => boolean;
}>();

defineEmits<{
  claim: [gift: Gift];
  release: [gift: Gift];
}>();
</script>

<template>
  <ul class="gift-list">
    <GiftCard
      v-for="gift in gifts"
      :key="gift.id"
      :gift="gift"
      :claimed="isClaimed(gift)"
      :device-claimed="isDeviceClaimed(gift)"
      @claim="$emit('claim', gift)"
      @release="$emit('release', gift)"
    />
  </ul>
</template>
