<script setup lang="ts">
import type { Gift } from '../types';

defineProps<{
  gift: Gift;
  claimed: boolean;
  deviceClaimed: boolean;
}>();

defineEmits<{
  claim: [];
  release: [];
}>();
</script>

<template>
  <li class="gift-card-slot">
    <article
      class="gift-card"
      :class="{ 'gift-card--claimed': claimed }"
    >
      <span
        class="gift-card__string"
        aria-hidden="true"
      />
      <span
        class="gift-card__hole"
        aria-hidden="true"
      />
      <p class="gift-card__category">
        {{ gift.category }}
      </p>
      <h3 class="gift-card__title">
        {{ gift.title }}
      </h3>
      <p class="gift-card__note">
        {{ gift.note }}
      </p>
      <p class="gift-card__price">
        <span
          class="gift-card__price-leader"
          aria-hidden="true"
        />
        {{ gift.priceLabel }}
      </p>
      <div class="gift-card__footer">
        <button
          v-if="!claimed"
          type="button"
          class="gift-card__claim"
          :aria-label="`Claim ${gift.title}`"
          @click="$emit('claim')"
        >
          Claim this gift
        </button>
        <p
          v-else
          class="gift-card__status"
        >
          <span
            class="gift-card__stamp"
            aria-hidden="true"
          >&#10003;</span>
          {{ deviceClaimed ? 'You claimed this' : 'Claimed with love' }}
        </p>
        <button
          v-if="deviceClaimed"
          type="button"
          class="gift-card__release"
          :aria-label="`Release your claim on ${gift.title}`"
          @click="$emit('release')"
        >
          release it
        </button>
        <a
          v-if="gift.shopUrl && !claimed"
          class="gift-card__shop-link"
          :href="gift.shopUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          see a suggestion
        </a>
      </div>
    </article>
  </li>
</template>
