<script setup lang="ts">
import { HOURS_CONTROL } from '~/constants/copy'
import type { WorkingHours } from '~/types'

const props = defineProps<{
  workingHours: WorkingHours
}>()

const emit = defineEmits<{
  change: [next: WorkingHours]
}>()

const startOptions = Array.from({ length: 24 }, (_, hour) => hour)

const endOptions = computed(() =>
  Array.from({ length: 24 - props.workingHours.start }, (_, index) => props.workingHours.start + 1 + index),
)

function onStartChange(event: Event) {
  const start = Number((event.target as HTMLSelectElement).value)
  emit('change', { start, end: Math.max(props.workingHours.end, start + 1) })
}

function onEndChange(event: Event) {
  const end = Number((event.target as HTMLSelectElement).value)
  emit('change', { start: props.workingHours.start, end })
}
</script>

<template>
  <fieldset class="hours">
    <legend class="field-label">
      {{ HOURS_CONTROL.legend }}
    </legend>
    <div class="hours-row">
      <label class="hours-item">
        <span class="hours-item-label">{{ HOURS_CONTROL.fromLabel }}</span>
        <select
          class="select-control"
          :value="workingHours.start"
          @change="onStartChange"
        >
          <option
            v-for="hour in startOptions"
            :key="hour"
            :value="hour"
          >{{ formatHourLabel(hour) }}</option>
        </select>
      </label>
      <span
        class="hours-dash"
        aria-hidden="true"
      >–</span>
      <label class="hours-item">
        <span class="hours-item-label">{{ HOURS_CONTROL.toLabel }}</span>
        <select
          class="select-control"
          :value="workingHours.end"
          @change="onEndChange"
        >
          <option
            v-for="hour in endOptions"
            :key="hour"
            :value="hour"
          >{{ formatHourLabel(hour) }}</option>
        </select>
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.hours {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.hours-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hours-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.hours-item-label {
  color: var(--color-ink-dim);
  font-size: 0.85rem;
}

.hours-dash {
  color: var(--color-ink-faint);
}
</style>
