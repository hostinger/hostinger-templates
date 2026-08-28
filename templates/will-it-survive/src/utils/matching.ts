import type { Answers, MatchCard, MatchOutcome, Plant } from '../types/content';
import { buildCaveats, buildReasons } from './reasons';

/** A result set never has fewer exact matches than this before falling back. */
export const MIN_EXACT_MATCHES = 2;
/** Total cards shown when nearest matches fill in for missing exact ones. */
export const FALLBACK_TOTAL = 3;
/** Upper bound of cards shown, even when more plants match exactly. */
export const MAX_MATCHES = 4;

export function isExactMatch(plant: Plant, answers: Answers): boolean {
  return (
    plant.light.includes(answers.light) &&
    plant.water.includes(answers.care) &&
    (answers.pets === 'no' || plant.petSafe)
  );
}

/** Counts how many of the three criteria a plant satisfies (0–3). */
export function scorePlant(plant: Plant, answers: Answers): number {
  const checks = [
    plant.light.includes(answers.light),
    plant.water.includes(answers.care),
    answers.pets === 'no' || plant.petSafe,
  ];
  return checks.filter(Boolean).length;
}

function toCard(plant: Plant, answers: Answers, exact: boolean): MatchCard {
  return {
    plant,
    exact,
    reasons: buildReasons(plant, answers),
    caveats: exact ? [] : buildCaveats(plant, answers),
  };
}

/**
 * Returns 2–4 plants for a complete set of answers.
 *
 * Exact matches win. When fewer than MIN_EXACT_MATCHES exist, the nearest
 * plants (highest score, catalogue order breaking ties) fill the set up to
 * FALLBACK_TOTAL and the outcome is flagged so the UI can be honest about it.
 * With pets in the house, non-pet-safe plants are never suggested — not even
 * as a fallback.
 */
export function matchPlants(plants: Plant[], answers: Answers): MatchOutcome {
  const pool = answers.pets === 'yes' ? plants.filter((plant) => plant.petSafe) : plants;
  const exact = pool.filter((plant) => isExactMatch(plant, answers));

  if (exact.length >= MIN_EXACT_MATCHES) {
    return {
      cards: exact.slice(0, MAX_MATCHES).map((plant) => toCard(plant, answers, true)),
      usedFallback: false,
    };
  }

  const nearest = pool
    .filter((plant) => !isExactMatch(plant, answers))
    .sort((a, b) => scorePlant(b, answers) - scorePlant(a, answers))
    .slice(0, FALLBACK_TOTAL - exact.length);

  return {
    cards: [
      ...exact.map((plant) => toCard(plant, answers, true)),
      ...nearest.map((plant) => toCard(plant, answers, false)),
    ],
    usedFallback: true,
  };
}
