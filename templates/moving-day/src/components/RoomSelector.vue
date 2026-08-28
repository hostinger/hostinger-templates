<script setup lang="ts">
import type { Room, RoomCounts } from '../types/content';

defineProps<{
  rooms: Room[];
  counts: RoomCounts;
}>();

const emit = defineEmits<{
  change: [id: string, value: number];
}>();
</script>

<template>
  <div class="room-grid">
    <article
      v-for="room in rooms"
      :key="room.id"
      class="room-card"
      :class="{ selected: counts[room.id] > 0 }"
    >
      <div class="room-card-top">
        <span
          class="room-icon"
          aria-hidden="true"
        >
          <svg
            v-if="room.icon === 'sofa'"
            viewBox="0 0 32 32"
          ><path d="M5 15v-3a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v3M4 15a3 3 0 0 1 3 3v5h18v-5a3 3 0 1 1 3 3v6H4v-6a3 3 0 1 1 0-6Z" /></svg>
          <svg
            v-else-if="room.icon === 'bed'"
            viewBox="0 0 32 32"
          ><path d="M4 25V8m0 10h24v7M8 18v-6h8a4 4 0 0 1 4 4v2M4 25h24M8 25v3m16-3v3" /></svg>
          <svg
            v-else-if="room.icon === 'chair'"
            viewBox="0 0 32 32"
          ><path d="M8 15h16l-2 7H10l-2-7Zm3 7-2 7m12-7 2 7M11 15V5h10v10" /></svg>
          <svg
            v-else-if="room.icon === 'desk'"
            viewBox="0 0 32 32"
          ><path d="M5 14h22v6H5v-6Zm3 6v8m16-8v8M11 9h10v5" /></svg>
          <svg
            v-else-if="room.icon === 'box'"
            viewBox="0 0 32 32"
          ><path d="M5 10l11-5 11 5v13l-11 5-11-5V10Zm0 0 11 5 11-5M16 15v13M11 7l11 5v5" /></svg>
          <svg
            v-else
            viewBox="0 0 32 32"
          ><path d="M16 4s8 9 8 16a8 8 0 0 1-16 0c0-7 8-16 8-16Zm-4 16a4 4 0 0 0 4 4" /></svg>
        </span>
        <span
          v-if="counts[room.id] > 0"
          class="selected-tick"
          aria-hidden="true"
        >✓</span>
      </div>
      <h3>{{ room.name }}</h3>
      <p>{{ room.description }}</p>
      <div
        class="counter"
        :aria-label="`${room.name} count`"
      >
        <button
          type="button"
          :disabled="counts[room.id] === 0"
          :aria-label="`Remove one ${room.name}`"
          @click="emit('change', room.id, counts[room.id] - 1)"
        >
          −
        </button>
        <output :aria-label="`${counts[room.id]} ${room.name}`">{{ counts[room.id] }}</output>
        <button
          type="button"
          :disabled="counts[room.id] === 5"
          :aria-label="`Add one ${room.name}`"
          @click="emit('change', room.id, counts[room.id] + 1)"
        >
          +
        </button>
      </div>
    </article>
  </div>
</template>
