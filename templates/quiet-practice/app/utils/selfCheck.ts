import type { SelfCheckQuestion } from '~/types/content'

/**
 * Sums the weight every answered option gives each service.
 * Weight keys that do not match a known service slug are ignored.
 */
export function scoreSelfCheck(
  questions: SelfCheckQuestion[],
  answerIndices: number[],
  serviceSlugs: string[],
): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const slug of serviceSlugs) {
    totals[slug] = 0
  }
  questions.forEach((question, questionIndex) => {
    const option = question.options[answerIndices[questionIndex] ?? -1]
    if (!option) {
      return
    }
    for (const [slug, points] of Object.entries(option.weights)) {
      if (slug in totals) {
        totals[slug] = (totals[slug] ?? 0) + (points ?? 0)
      }
    }
  })
  return totals
}

/**
 * Resolves the service the completed check routes to.
 *
 * The service with the highest total wins. On a tie, answers are replayed
 * in order and the tied service that took the lead earliest wins — the first
 * question ("who are the sessions for?") is deliberately the heaviest signal.
 * If everything still ties, the order of `serviceSlugs` decides.
 */
export function resolveServiceSlug(
  questions: SelfCheckQuestion[],
  answerIndices: number[],
  serviceSlugs: string[],
): string {
  const fallback = serviceSlugs[0] ?? ''
  const totals = scoreSelfCheck(questions, answerIndices, serviceSlugs)
  const best = Math.max(...serviceSlugs.map(slug => totals[slug] ?? 0))
  let candidates = serviceSlugs.filter(slug => (totals[slug] ?? 0) === best)
  if (candidates.length <= 1) {
    return candidates[0] ?? fallback
  }

  const running: Record<string, number> = {}
  for (const slug of candidates) {
    running[slug] = 0
  }
  for (const [questionIndex, question] of questions.entries()) {
    const option = question.options[answerIndices[questionIndex] ?? -1]
    if (!option) {
      continue
    }
    for (const [slug, points] of Object.entries(option.weights)) {
      if (slug in running) {
        running[slug] = (running[slug] ?? 0) + (points ?? 0)
      }
    }
    const lead = Math.max(...candidates.map(slug => running[slug] ?? 0))
    const leaders = candidates.filter(slug => (running[slug] ?? 0) === lead)
    if (leaders.length === 1) {
      return leaders[0] ?? fallback
    }
    candidates = leaders
  }
  return candidates[0] ?? fallback
}
