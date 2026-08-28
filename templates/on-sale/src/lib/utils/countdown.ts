export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  complete: boolean
}

export const getCountdown = (targetDate: string, now = Date.now()): CountdownParts => {
  const remaining = Math.max(0, new Date(targetDate).getTime() - now)

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
    complete: remaining === 0,
  }
}
