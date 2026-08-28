<script setup lang="ts">
import { CITIES } from '~/constants/cities'
import { PICKER } from '~/constants/copy'
import type { City } from '~/types'

const props = defineProps<{
  selectedSlugs: string[]
}>()

const emit = defineEmits<{
  add: [slug: string]
}>()

const query = ref('')
const open = ref(false)
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

const available = computed<City[]>(() =>
  CITIES.filter((city) => !props.selectedSlugs.includes(city.slug)),
)

const matches = computed<City[]>(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return available.value
  return available.value.filter(
    (city) =>
      city.label.toLowerCase().includes(needle)
      || city.country.toLowerCase().includes(needle)
      || city.slug.includes(needle),
  )
})

watch(matches, (next) => {
  if (activeIndex.value >= next.length) activeIndex.value = 0
})

function optionId(index: number): string {
  return `city-option-${index}`
}

const activeDescendant = computed(() =>
  open.value && matches.value.length > 0 ? optionId(activeIndex.value) : undefined,
)

function select(city: City) {
  emit('add', city.slug)
  query.value = ''
  activeIndex.value = 0
  inputEl.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    open.value = true
    activeIndex.value = (activeIndex.value + 1) % Math.max(matches.value.length, 1)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    open.value = true
    const count = Math.max(matches.value.length, 1)
    activeIndex.value = (activeIndex.value - 1 + count) % count
  }
  else if (event.key === 'Home' && open.value) {
    event.preventDefault()
    activeIndex.value = 0
  }
  else if (event.key === 'End' && open.value) {
    event.preventDefault()
    activeIndex.value = Math.max(matches.value.length - 1, 0)
  }
  else if (event.key === 'Enter') {
    if (open.value && matches.value[activeIndex.value]) {
      event.preventDefault()
      select(matches.value[activeIndex.value] as City)
    }
  }
  else if (event.key === 'Escape') {
    open.value = false
  }
}

function onBlur() {
  // Delayed so option mousedown (which prevents default) still lands.
  window.setTimeout(() => {
    open.value = false
  }, 0)
}
</script>

<template>
  <div class="picker">
    <label
      class="field-label"
      for="city-picker-input"
    >{{ PICKER.label }}</label>
    <div class="picker-field">
      <svg
        class="picker-icon"
        viewBox="0 0 20 20"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <circle
          cx="8.5"
          cy="8.5"
          r="5.5"
        />
        <path d="m13 13 4 4" />
      </svg>
      <input
        id="city-picker-input"
        ref="inputEl"
        v-model="query"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        aria-controls="city-picker-listbox"
        :aria-expanded="open"
        :aria-activedescendant="activeDescendant"
        :placeholder="PICKER.placeholder"
        @focus="open = true"
        @input="open = true"
        @keydown="onKeydown"
        @blur="onBlur"
      >
      <ul
        v-show="open"
        id="city-picker-listbox"
        role="listbox"
        :aria-label="PICKER.label"
        class="picker-list"
      >
        <li
          v-for="(city, index) in matches"
          :id="optionId(index)"
          :key="city.slug"
          role="option"
          :aria-selected="index === activeIndex"
          class="picker-option"
          :class="{ 'is-active': index === activeIndex }"
          @mousedown.prevent="select(city)"
          @mousemove="activeIndex = index"
        >
          <span class="picker-option-label">{{ city.label }}</span>
          <span class="picker-option-country">{{ city.country }}</span>
        </li>
        <li
          v-if="matches.length === 0"
          class="picker-empty"
          role="presentation"
        >
          {{ query.trim() ? `${PICKER.noMatch} “${query.trim()}”` : PICKER.allAdded }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.picker {
  position: relative;
  min-width: 0;
}

.picker-field {
  position: relative;
}

.picker-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  width: 1rem;
  height: 1rem;
  transform: translateY(-50%);
  color: var(--color-ink-faint);
  pointer-events: none;
}

.picker-field input {
  width: 100%;
  padding: 0.55rem 0.8rem 0.55rem 2.35rem;
  border: 1px solid transparent;
  border-radius: 999px;
  background:
    linear-gradient(var(--color-surface), var(--color-surface)) padding-box,
    var(--gradient-aurora) border-box;
  color: var(--color-ink);
}

.picker-field input::placeholder {
  color: var(--color-ink-faint);
}

.picker-list {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 17rem;
  margin: 0;
  padding: 0.35rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-m);
  background: var(--color-bg-deep);
  box-shadow: 0 18px 40px rgba(6, 8, 24, 0.6);
}

.picker-option {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.7rem;
  border-radius: var(--radius-s);
  cursor: pointer;
}

.picker-option.is-active {
  background: rgba(122, 162, 255, 0.16);
}

.picker-option-label {
  font-weight: 600;
}

.picker-option-country {
  color: var(--color-ink-dim);
  font-size: 0.8rem;
  text-align: right;
}

.picker-empty {
  padding: 0.6rem 0.7rem;
  color: var(--color-ink-dim);
  font-size: 0.9rem;
}
</style>
