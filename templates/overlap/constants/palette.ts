import type { TimeOfDay } from '~/types'

/**
 * Night-to-day panorama palette: one background color per local hour (0–23),
 * moving indigo → dawn peach → warm daylight → dusk violet and back.
 * Tweak these to retheme the strips.
 */
export const HOUR_COLORS: readonly string[] = [
  '#181a3f', // 00
  '#15173a', // 01
  '#131536', // 02
  '#121433', // 03
  '#141838', // 04
  '#232253', // 05
  '#3d3268', // 06
  '#7a4a72', // 07
  '#c96f6d', // 08
  '#e89a6b', // 09
  '#f4b878', // 10
  '#f9cd8a', // 11
  '#fbd995', // 12
  '#fad391', // 13
  '#f6c583', // 14
  '#f0b478', // 15
  '#e59d6f', // 16
  '#d0806f', // 17
  '#a75f78', // 18
  '#7c4a79', // 19
  '#55356f', // 20
  '#3a2a5e', // 21
  '#262050', // 22
  '#1c1c46', // 23
]

/** Hours whose background is light enough to need dark text for AA contrast. */
const DARK_TEXT_HOURS = new Set([8, 9, 10, 11, 12, 13, 14, 15, 16, 17])

const CELL_TEXT_DARK = '#241536'
const CELL_TEXT_LIGHT = '#eceaff'

export function hourCellColors(localHour: number): { background: string, color: string } {
  return {
    background: HOUR_COLORS[localHour] ?? HOUR_COLORS[0]!,
    color: DARK_TEXT_HOURS.has(localHour) ? CELL_TEXT_DARK : CELL_TEXT_LIGHT,
  }
}

/** Representative swatch per time-of-day bucket, used by the legend. */
export const TIME_OF_DAY_SWATCHES: Record<TimeOfDay, string> = {
  night: HOUR_COLORS[1]!,
  early: HOUR_COLORS[6]!,
  work: HOUR_COLORS[12]!,
  evening: HOUR_COLORS[19]!,
}
