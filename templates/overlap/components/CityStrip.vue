<script setup lang="ts">
import { hourCellColors } from '~/constants/palette'
import { BOARD } from '~/constants/copy'
import type { StripRow } from '~/types'

defineProps<{
  row: StripRow
  overlapColumns: boolean[]
}>()

defineEmits<{
  remove: [slug: string]
}>()
</script>

<template>
  <div class="strip">
    <div class="strip-plate">
      <div class="strip-plate-text">
        <span class="strip-city">{{ row.city.label }}</span>
        <span class="strip-meta tabular">{{ row.city.country }} · {{ row.offsetLabel }}</span>
      </div>
      <button
        type="button"
        class="strip-remove"
        :aria-label="`${BOARD.removeCity} ${row.city.label}`"
        @click="$emit('remove', row.city.slug)"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div
      v-for="cell in row.cells"
      :key="cell.column"
      class="strip-cell tabular"
      :class="{ 'is-overlap': overlapColumns[cell.column] }"
      :style="hourCellColors(cell.localHour)"
    >
      <span class="sr-only">{{ row.city.label }} {{ formatHourLabel(cell.localHour) }}</span>
      <span aria-hidden="true">{{ String(cell.localHour).padStart(2, '0') }}</span>
    </div>
  </div>
</template>

<style scoped>
.strip {
  display: contents;
}

.strip-plate {
  position: sticky;
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  height: var(--strip-h);
  padding: 0.3rem 0.55rem 0.3rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-s) 0 0 var(--radius-s);
  background: var(--color-plate);
  box-shadow: 8px 0 14px rgba(9, 11, 30, 0.55);
}

.strip-plate-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.25;
}

.strip-city {
  font-weight: 700;
  font-size: 0.92rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.strip-meta {
  color: var(--color-ink-dim);
  font-size: 0.68rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.strip-remove {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: transparent;
  color: var(--color-ink-dim);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: color 140ms ease, border-color 140ms ease;
}

.strip-remove:hover {
  color: var(--color-aurora-mint);
  border-color: var(--color-aurora-mint);
}

.strip-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--strip-h);
  font-size: 0.72rem;
  font-weight: 600;
}

.strip-cell.is-overlap {
  filter: saturate(1.15) brightness(1.08);
}
</style>
