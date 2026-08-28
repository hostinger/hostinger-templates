import type { City, OverlapRange, StripRow, WorkingHours } from '~/types'

interface ClosestHint {
  column: number
  workingCount: number
  totalCount: number
}

/**
 * Computes the per-city hour strips and the overlap band, aligned to the
 * viewer's local day. All math uses the Intl API only. Computation starts
 * after mount (`now` is set client-side) so statically generated markup
 * never disagrees with the client clock.
 */
export function useOverlap(
  cities: Ref<City[]>,
  workingHours: Ref<WorkingHours>,
) {
  const now = ref<Date | null>(null)

  onMounted(() => {
    now.value = new Date()
  })

  const rows = computed<StripRow[]>(() => {
    if (!now.value) return []
    const instants = viewerDayInstants(now.value)
    return cities.value.map((city) => ({
      city,
      offsetLabel: offsetLabel(now.value as Date, city.timeZone),
      cells: instants.map((instant, column) => {
        const localHour = localHourAt(instant, city.timeZone)
        return {
          column,
          localHour,
          timeOfDay: timeOfDay(localHour),
          isWorking: isWithinWorkingHours(localHour, workingHours.value),
        }
      }),
    }))
  })

  /** For each viewer-day column: how many cities are inside working hours. */
  const workingCounts = computed<number[]>(() =>
    Array.from({ length: 24 }, (_, column) =>
      rows.value.reduce((count, row) => count + (row.cells[column]?.isWorking ? 1 : 0), 0),
    ),
  )

  /** Columns where every selected city is inside working hours. */
  const overlapColumns = computed<boolean[]>(() =>
    workingCounts.value.map(
      (count) => rows.value.length > 0 && count === rows.value.length,
    ),
  )

  /** Contiguous overlap ranges, used to draw the glow band. */
  const overlapRanges = computed<OverlapRange[]>(() => {
    const ranges: OverlapRange[] = []
    let start: number | null = null
    for (let column = 0; column <= 24; column += 1) {
      const inBand = column < 24 && overlapColumns.value[column]
      if (inBand && start === null) start = column
      if (!inBand && start !== null) {
        ranges.push({ start, end: column })
        start = null
      }
    }
    return ranges
  })

  /** When there is no overlap, the best available hour and its coverage. */
  const closestHint = computed<ClosestHint | null>(() => {
    if (rows.value.length < 2 || overlapRanges.value.length > 0) return null
    const best = Math.max(...workingCounts.value)
    if (best === 0) return null
    return {
      column: workingCounts.value.indexOf(best),
      workingCount: best,
      totalCount: rows.value.length,
    }
  })

  const viewerNowHour = computed<number | null>(() =>
    now.value ? now.value.getHours() : null,
  )

  const dayLabel = computed<string>(() =>
    now.value ? viewerDayLabel(now.value) : '',
  )

  return { rows, overlapColumns, overlapRanges, closestHint, viewerNowHour, dayLabel }
}
