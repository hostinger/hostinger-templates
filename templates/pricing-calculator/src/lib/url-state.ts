import type { EstimateInput, NumericLimit } from '$lib/types/pricing'

const PARAMS = { seats: 'seats', usage: 'calls' } as const

function parseValue(value: string | null, limit: NumericLimit): number | null {
  if (value === null || value.trim() === '') return null

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) return null
  if (parsed < limit.min || parsed > limit.max) return null

  return parsed
}

export function readEstimate(
  search: URLSearchParams,
  defaults: EstimateInput,
  limits: { seats: NumericLimit; usage: NumericLimit },
): EstimateInput {
  return {
    seats: parseValue(search.get(PARAMS.seats), limits.seats) ?? defaults.seats,
    usage: parseValue(search.get(PARAMS.usage), limits.usage) ?? defaults.usage,
  }
}

export function writeEstimate(url: URL, input: EstimateInput): URL {
  const next = new URL(url)
  next.searchParams.set(PARAMS.seats, String(input.seats))
  next.searchParams.set(PARAMS.usage, String(input.usage))
  return next
}
