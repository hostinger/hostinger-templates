<script setup lang="ts">
import type { Service } from '~/types/site'

defineProps<{
  service: Service
  index: number
}>()
</script>

<template>
  <article class="outcome-note" :class="`outcome-note--${index + 1}`">
    <div class="note-topline">
      <span>{{ service.number }}</span>
      <span class="tape" aria-hidden="true" />
    </div>
    <h3>{{ service.title }}</h3>
    <p>{{ service.summary }}</p>
    <span class="scribble">{{ service.annotation }}</span>
  </article>
</template>
