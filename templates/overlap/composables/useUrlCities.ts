import { CITY_BY_SLUG, DEFAULT_CITY_SLUGS, DEFAULT_WORKING_HOURS } from '~/constants/cities'
import type { WorkingHours } from '~/types'

const CITIES_PARAM = 'cities'
const FROM_PARAM = 'from'
const TO_PARAM = 'to'

function parseHourParam(raw: string | null, min: number, max: number): number | null {
  if (raw === null || !/^\d{1,2}$/.test(raw)) return null
  const value = Number(raw)
  return value >= min && value <= max ? value : null
}

/**
 * Owns the selected city list and working-hours window, hydrates both from
 * the URL query on mount, and keeps the URL synchronized via replaceState.
 * URL work happens client-side only, which keeps static generation
 * hydration-safe.
 */
export function useUrlCities() {
  const selectedSlugs = ref<string[]>([...DEFAULT_CITY_SLUGS])
  const workingHours = ref<WorkingHours>({ ...DEFAULT_WORKING_HOURS })
  /** False until the URL has been read on the client. */
  const ready = ref(false)

  function syncUrl() {
    const params = new URLSearchParams()
    if (selectedSlugs.value.length > 0) {
      params.set(CITIES_PARAM, selectedSlugs.value.join(','))
    }
    params.set(FROM_PARAM, String(workingHours.value.start))
    params.set(TO_PARAM, String(workingHours.value.end))
    const query = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}?${query}`)
  }

  onMounted(() => {
    const params = new URLSearchParams(window.location.search)

    const rawCities = params.get(CITIES_PARAM)
    if (rawCities !== null) {
      // Unknown slugs are dropped silently; duplicates collapse to one.
      const valid = rawCities
        .split(',')
        .map((slug) => slug.trim().toLowerCase())
        .filter((slug) => slug in CITY_BY_SLUG)
      selectedSlugs.value = [...new Set(valid)]
    }

    const from = parseHourParam(params.get(FROM_PARAM), 0, 23)
    if (from !== null) workingHours.value.start = from
    const to = parseHourParam(params.get(TO_PARAM), 1, 24)
    if (to !== null && to > workingHours.value.start) workingHours.value.end = to
    if (workingHours.value.end <= workingHours.value.start) {
      workingHours.value.end = workingHours.value.start + 1
    }

    ready.value = true
    watch([selectedSlugs, workingHours], syncUrl, { deep: true })
    syncUrl()
  })

  function addCity(slug: string) {
    if (slug in CITY_BY_SLUG && !selectedSlugs.value.includes(slug)) {
      selectedSlugs.value = [...selectedSlugs.value, slug]
    }
  }

  function removeCity(slug: string) {
    selectedSlugs.value = selectedSlugs.value.filter((existing) => existing !== slug)
  }

  function setWorkingHours(next: WorkingHours) {
    const start = Math.min(Math.max(next.start, 0), 23)
    const end = Math.min(Math.max(next.end, start + 1), 24)
    workingHours.value = { start, end }
  }

  return { selectedSlugs, workingHours, ready, addCity, removeCity, setWorkingHours }
}
