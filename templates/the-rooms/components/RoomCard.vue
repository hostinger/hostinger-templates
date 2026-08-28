<script setup lang="ts">
import type { Room } from '~/types'
import { getRoomImage } from '~/utils/images'

defineProps<{ room: Room; index: number }>()
</script>

<template>
  <article class="room-card">
    <NuxtLink :to="`/rooms/${room.slug}`" class="room-card__image">
      <img :src="getRoomImage(room.slug)" :alt="room.imageAlt">
      <span class="key-label">{{ room.key }}</span>
    </NuxtLink>
    <div class="room-card__body">
      <p class="room-card__number">ROOM {{ String(index + 1).padStart(2, '0') }}</p>
      <h3><NuxtLink :to="`/rooms/${room.slug}`">{{ room.name }}</NuxtLink></h3>
      <p class="room-card__deck">{{ room.deck }}</p>
      <p>{{ room.description }}</p>
      <dl>
        <div><dt>Sleeps</dt><dd>{{ room.sleeps }}</dd></div>
        <div><dt>Bed</dt><dd>{{ room.bed }}</dd></div>
        <div><dt>Size</dt><dd>{{ room.size }}</dd></div>
      </dl>
      <NuxtLink class="text-link" :to="`/rooms/${room.slug}`">
        Open room notes <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>
  </article>
</template>
