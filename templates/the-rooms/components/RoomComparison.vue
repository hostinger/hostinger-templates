<script setup lang="ts">
import type { Room, SeasonalRate } from '~/types'

defineProps<{
  rooms: Room[]
  rates: SeasonalRate[]
}>()
</script>

<template>
  <div class="comparison-wrap" tabindex="0" role="region" aria-label="Room comparison table">
    <table class="comparison">
      <caption>Side-by-side room guide and current published nightly rates</caption>
      <thead>
        <tr>
          <th scope="col">Room notes</th>
          <th v-for="room in rooms" :key="room.slug" scope="col">
            <span class="key-label key-label--table">{{ room.key }}</span>
            <NuxtLink :to="`/rooms/${room.slug}`">{{ room.name }}</NuxtLink>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Bed</th>
          <td v-for="room in rooms" :key="room.slug">{{ room.bed }}</td>
        </tr>
        <tr>
          <th scope="row">Room size</th>
          <td v-for="room in rooms" :key="room.slug">{{ room.size }}</td>
        </tr>
        <tr>
          <th scope="row">Outlook</th>
          <td v-for="room in rooms" :key="room.slug">{{ room.outlook }}</td>
        </tr>
        <tr v-for="rate in rates" :key="rate.season">
          <th scope="row">
            {{ rate.season }}
            <small>{{ rate.months }}</small>
          </th>
          <td v-for="room in rooms" :key="room.slug">
            £{{ rate.nightly[room.slug] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
