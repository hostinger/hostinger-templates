<script setup lang="ts">
import { LEGEND } from '~/constants/copy'
import { TIME_OF_DAY_SWATCHES } from '~/constants/palette'

const entries = [
  { label: LEGEND.night, color: TIME_OF_DAY_SWATCHES.night },
  { label: LEGEND.early, color: TIME_OF_DAY_SWATCHES.early },
  { label: LEGEND.work, color: TIME_OF_DAY_SWATCHES.work },
  { label: LEGEND.evening, color: TIME_OF_DAY_SWATCHES.evening },
]
</script>

<template>
  <div
    class="legend"
    :aria-label="LEGEND.title"
  >
    <span class="legend-title">{{ LEGEND.title }}</span>
    <ul class="legend-list">
      <li
        v-for="entry in entries"
        :key="entry.label"
        class="legend-item"
      >
        <span
          class="legend-swatch"
          :style="{ background: entry.color }"
          aria-hidden="true"
        />
        {{ entry.label }}
      </li>
      <li class="legend-item">
        <span
          class="legend-swatch legend-swatch-band"
          aria-hidden="true"
        />
        {{ LEGEND.overlap }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
}

.legend-title {
  color: var(--color-ink-dim);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.legend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-ink-dim);
  font-size: 0.82rem;
}

.legend-swatch {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 4px;
  border: 1px solid rgba(236, 234, 255, 0.18);
}

.legend-swatch-band {
  background: rgba(110, 231, 200, 0.16);
  border-color: var(--color-band);
  box-shadow: 0 0 8px rgba(110, 231, 200, 0.45);
}
</style>
