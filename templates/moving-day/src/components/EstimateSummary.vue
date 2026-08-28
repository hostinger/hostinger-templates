<script setup lang="ts">
import { computed } from 'vue';
import site from '../data/site.json';
import type { Room, RoomCounts, Van } from '../types/content';

const props = defineProps<{
  selectedRooms: Room[];
  counts: RoomCounts;
  totalRooms: number;
  totalVolume: number;
  van: Van;
  estimate: number;
  disclaimer: string;
}>();

defineEmits<{ reset: [] }>();

const mailto = computed(() => {
  const inventory = props.selectedRooms
    .map((room) => `${props.counts[room.id]} × ${room.name}`)
    .join(', ');
  const subject = 'Moving quote enquiry';
  const body = [
    'Hello Moving Day,',
    '',
    'I’d like a fixed quote for my move.',
    `Rooms: ${inventory || 'Not selected yet'}`,
    `Estimated volume: ${props.totalVolume}m³`,
    `Suggested vehicle: ${props.van.name}`,
    `Online guide: £${props.estimate || 0}`,
    '',
    'Moving from:',
    'Moving to:',
    'Preferred date:',
    'Access notes:',
  ].join('\n');

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
</script>

<template>
  <aside
    class="estimate-summary"
    aria-live="polite"
  >
    <div class="summary-heading">
      <div>
        <p class="mini-label">
          Your move, at a glance
        </p>
        <h3>{{ totalRooms ? `${totalRooms} room${totalRooms === 1 ? '' : 's'} selected` : 'Start with your rooms' }}</h3>
      </div>
      <button
        v-if="totalRooms"
        type="button"
        class="reset-button"
        @click="$emit('reset')"
      >
        Reset
      </button>
    </div>

    <div
      v-if="totalRooms"
      class="selection-list"
    >
      <span
        v-for="room in selectedRooms"
        :key="room.id"
      >
        {{ counts[room.id] }} × {{ room.short }}
      </span>
    </div>
    <p
      v-else
      class="empty-copy"
    >
      Use the + buttons to tell us what you’re moving. Your recommendation will appear here.
    </p>

    <div
      class="van-result"
      :class="{ muted: !totalRooms }"
    >
      <span
        class="van-drawing"
        aria-hidden="true"
      >
        <svg viewBox="0 0 90 48"><path d="M4 11h52v27H4V11Zm52 9h17l12 12v6H56V20Z" /><circle
          cx="20"
          cy="39"
          r="6"
        /><circle
          cx="70"
          cy="39"
          r="6"
        /><path d="M62 23h9l8 9H62v-9Z" /></svg>
      </span>
      <div>
        <small>We recommend</small>
        <strong>{{ totalRooms ? van.name : 'Your ideal van' }}</strong>
        <span>{{ totalRooms ? van.note : 'Matched to your move' }}</span>
      </div>
    </div>

    <div class="price-result">
      <div>
        <small>Ballpark price</small>
        <strong>{{ estimate ? `£${estimate}` : '—' }}</strong>
      </div>
      <span v-if="totalRooms">{{ totalVolume }}m³<br>estimated</span>
    </div>

    <p class="disclaimer">
      {{ disclaimer }}
    </p>
    <a
      class="button button-coral"
      :class="{ disabled: !totalRooms }"
      :href="totalRooms ? mailto : '#estimate'"
      :aria-disabled="!totalRooms"
    >
      Email for a fixed quote <span>↗</span>
    </a>
    <a
      class="summary-phone"
      :href="`tel:${site.phoneHref}`"
    >Or call {{ site.phoneDisplay }}</a>
  </aside>
</template>
