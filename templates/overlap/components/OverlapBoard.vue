<script setup lang="ts">
import { BOARD } from '~/constants/copy'
import type { OverlapRange, StripRow } from '~/types'

const props = defineProps<{
  loading: boolean
  rows: StripRow[]
  overlapColumns: boolean[]
  overlapRanges: OverlapRange[]
  closestHint: { column: number, workingCount: number, totalCount: number } | null
  viewerNowHour: number | null
  dayLabel: string
}>()

defineEmits<{
  remove: [slug: string]
}>()

const hours = Array.from({ length: 24 }, (_, hour) => hour)

const totalOverlapHours = computed(() =>
  props.overlapRanges.reduce((sum, range) => sum + (range.end - range.start), 0),
)

const bandText = computed(() => {
  if (props.overlapRanges.length === 0) return null
  const spans = props.overlapRanges
    .map((range) => `${formatHourLabel(range.start)}–${formatHourLabel(range.end)}`)
    .join(' · ')
  const unit = totalOverlapHours.value === 1 ? BOARD.bandHourSingular : BOARD.bandHourPlural
  return `${spans} ${BOARD.bandYourTime} (${totalOverlapHours.value} ${unit})`
})

const closestText = computed(() => {
  if (!props.closestHint) return null
  return `${BOARD.closestPrefix} ${formatHourLabel(props.closestHint.column)} ${BOARD.bandYourTime}, ${BOARD.closestSuffix(props.closestHint.workingCount, props.closestHint.totalCount)}.`
})

/**
 * The glow overlay tracks the 24 fluid columns with calc(): the label column
 * has a fixed width (--label-w), so each hour column is 1/24 of the rest.
 */
function rangeStyle(range: OverlapRange): Record<string, string> {
  return {
    left: `calc(var(--label-w) + (100% - var(--label-w)) * ${range.start / 24})`,
    width: `calc((100% - var(--label-w)) * ${(range.end - range.start) / 24})`,
  }
}
</script>

<template>
  <section
    class="board"
    aria-label="Timezone overlap board"
  >
    <div
      class="board-summary"
      role="status"
      aria-live="polite"
    >
      <template v-if="!loading && rows.length > 0">
        <p
          v-if="bandText"
          class="board-band"
        >
          <span class="board-band-dot" aria-hidden="true" />
          <strong>{{ BOARD.bandPrefix }}</strong>&nbsp;{{ bandText }}
        </p>
        <p
          v-else
          class="board-noband"
        >
          {{ BOARD.noOverlap }}<template v-if="closestText"> — {{ closestText }}</template>
        </p>
      </template>
    </div>

    <div
      v-if="loading"
      class="board-skeleton"
      aria-hidden="true"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="board-skeleton-row"
      />
    </div>
    <p
      v-if="loading"
      class="sr-only"
    >
      {{ BOARD.loading }}
    </p>

    <p
      v-else-if="rows.length === 0"
      class="board-empty"
    >
      {{ BOARD.noCities }}
    </p>

    <div
      v-else
      class="board-scroll"
    >
      <div class="board-grid">
        <div
          v-for="range in overlapRanges"
          :key="range.start"
          class="board-glow"
          :style="rangeStyle(range)"
          aria-hidden="true"
        />

        <div class="board-corner">
          <span class="board-corner-note">{{ BOARD.referenceNote }}</span>
          <span class="board-corner-day">{{ dayLabel }}</span>
        </div>
        <div
          v-for="hour in hours"
          :key="hour"
          class="board-hour tabular"
          :class="{ 'is-now': hour === viewerNowHour, 'is-overlap': overlapColumns[hour] }"
        >
          <span class="sr-only">{{ formatHourLabel(hour) }}</span>
          <span aria-hidden="true">{{ String(hour).padStart(2, '0') }}</span>
          <span
            v-if="hour === viewerNowHour"
            class="board-now"
          >{{ BOARD.nowLabel }}</span>
        </div>

        <CityStrip
          v-for="row in rows"
          :key="row.city.slug"
          :row="row"
          :overlap-columns="overlapColumns"
          @remove="$emit('remove', $event)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.board {
  min-width: 0;
}

.board-summary {
  min-height: 1.7rem;
  margin-bottom: 0.65rem;
}

.board-band {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.board-band-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--color-band);
  box-shadow: var(--shadow-band);
}

.board-noband {
  color: var(--color-ink-dim);
  font-size: 0.95rem;
}

.board-skeleton {
  display: grid;
  gap: 8px;
}

.board-skeleton-row {
  height: var(--strip-h);
  border-radius: var(--radius-s);
  background: linear-gradient(
    100deg,
    var(--color-surface) 30%,
    var(--color-plate) 50%,
    var(--color-surface) 70%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .board-skeleton-row {
    animation: none;
  }
}

.board-empty {
  padding: 1.4rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-m);
  color: var(--color-ink-dim);
  text-align: center;
}

.board-scroll {
  overflow-x: auto;
  padding-bottom: 0.4rem;
  scrollbar-color: var(--color-border) transparent;
}

.board-grid {
  position: relative;
  display: grid;
  grid-template-columns: var(--label-w) repeat(24, minmax(var(--cell-min), 1fr));
  row-gap: 8px;
  min-width: calc(var(--label-w) + 24 * var(--cell-min));
}

.board-glow {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  border: 1px solid rgba(143, 245, 210, 0.55);
  border-radius: 10px;
  background: linear-gradient(
    180deg,
    rgba(110, 231, 200, 0.12),
    rgba(122, 162, 255, 0.05) 60%,
    rgba(110, 231, 200, 0.12)
  );
  box-shadow: var(--shadow-band), inset 0 0 18px rgba(110, 231, 200, 0.12);
  pointer-events: none;
}

.board-corner {
  position: sticky;
  left: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.25rem 0.75rem 0.4rem 0.15rem;
  background: transparent;
  line-height: 1.3;
}

.board-corner-note {
  color: var(--color-ink-dim);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.board-corner-day {
  font-size: 0.85rem;
  font-weight: 600;
}

.board-hour {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0.35rem;
  color: var(--color-ink-faint);
  font-size: 0.68rem;
}

.board-hour.is-overlap {
  color: var(--color-band);
}

.board-hour.is-now {
  color: var(--color-ink);
  font-weight: 700;
}

.board-now {
  position: absolute;
  top: -0.15rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 0.3rem;
  border-radius: 999px;
  background: var(--gradient-aurora);
  color: #0d0f24;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
