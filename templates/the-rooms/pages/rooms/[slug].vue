<script setup lang="ts">
import roomsData from '~/data/rooms.json'
import ratesData from '~/data/rates.json'
import { site } from '~/data/site'
import type { Room, SeasonalRate } from '~/types'
import { getRoomImage } from '~/utils/images'

const route = useRoute()
const rooms = roomsData as Room[]
const rates = ratesData as SeasonalRate[]
const room = rooms.find((entry) => entry.slug === route.params.slug)

if (!room) {
  throw createError({ statusCode: 404, statusMessage: 'Room not found' })
}

const roomIndex = rooms.findIndex((entry) => entry.slug === room.slug)
const nextRoom = rooms[(roomIndex + 1) % rooms.length]

useSeoMeta({
  title: `${room.name} — ${site.name}`,
  description: room.description,
})
</script>

<template>
  <div class="room-page">
    <section class="room-hero">
      <img :src="getRoomImage(room.slug)" :alt="room.imageAlt">
      <div class="room-hero__label">
        <span class="key-label">{{ room.key }}</span>
        <p>{{ room.outlook }}</p>
      </div>
    </section>

    <section class="room-story section-shell">
      <div class="room-story__title">
        <p class="eyebrow">Room {{ String(roomIndex + 1).padStart(2, '0') }}</p>
        <h1>{{ room.name }}</h1>
        <p class="room-story__deck">{{ room.deck }}</p>
      </div>
      <div class="room-story__copy">
        <p>{{ room.longDescription }}</p>
        <dl>
          <div><dt>Sleeps</dt><dd>{{ room.sleeps }}</dd></div>
          <div><dt>Bed</dt><dd>{{ room.bed }}</dd></div>
          <div><dt>Floor area</dt><dd>{{ room.size }}</dd></div>
          <div><dt>Outlook</dt><dd>{{ room.outlook }}</dd></div>
        </dl>
      </div>
    </section>

    <TideRule />

    <section class="room-notes section-shell">
      <div>
        <p class="eyebrow">In the room</p>
        <h2>What the key opens</h2>
      </div>
      <ul>
        <li v-for="detail in room.details" :key="detail">{{ detail }}</li>
      </ul>
      <aside>
        <span>GOOD TO KNOW</span>
        <p>{{ room.goodToKnow }}</p>
      </aside>
    </section>

    <section class="room-rates">
      <div class="section-shell">
        <div>
          <p class="eyebrow">Published rates</p>
          <h2>Night by night</h2>
        </div>
        <div class="room-rates__list">
          <article v-for="rate in rates" :key="rate.season">
            <p>{{ rate.season }}</p>
            <strong>£{{ rate.nightly[room.slug] }}</strong>
            <span>{{ rate.months }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="room-book section-shell">
      <div>
        <p class="eyebrow">Set a course</p>
        <h2>Bring your dates.</h2>
        <p v-if="site.bookingUrl">
          We will pass them to the booking partner. You will see live availability before confirming anything.
        </p>
        <p v-else>
          We will add them to an email enquiry and reply with availability. Nothing is reserved until we confirm.
        </p>
      </div>
      <DatePlanner :room-name="room.name" compact />
    </section>

    <NuxtLink class="next-room" :to="`/rooms/${nextRoom.slug}`">
      <span>Next key</span>
      <strong>{{ nextRoom.name }}</strong>
      <i aria-hidden="true">→</i>
    </NuxtLink>
  </div>
</template>
