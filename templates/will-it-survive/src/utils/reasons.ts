import { quiz } from '../content';
import type { Answers, Plant } from '../types/content';
import { CARE_HABITS, LIGHT_LEVELS } from '../types/content';

/** Honest reasons why a plant suits the given answers, straight from its tags. */
export function buildReasons(plant: Plant, answers: Answers): string[] {
  const reasons: string[] = [];
  if (plant.light.includes(answers.light)) {
    reasons.push(quiz.reasons.light[answers.light]);
  }
  if (plant.water.includes(answers.care)) {
    reasons.push(quiz.reasons.care[answers.care]);
  }
  if (answers.pets === 'yes' && plant.petSafe) {
    reasons.push(quiz.reasons.pets.yes);
  }
  return reasons;
}

/** Honest warnings for near-miss plants: states exactly which habit clashes. */
export function buildCaveats(plant: Plant, answers: Answers): string[] {
  const caveats: string[] = [];
  if (!plant.light.includes(answers.light)) {
    caveats.push(
      wantsMoreThanOffered(plant.light, answers.light, LIGHT_LEVELS)
        ? quiz.mismatches.light.brighter
        : quiz.mismatches.light.dimmer,
    );
  }
  if (!plant.water.includes(answers.care)) {
    caveats.push(
      wantsMoreThanOffered(plant.water, answers.care, CARE_HABITS)
        ? quiz.mismatches.care.more
        : quiz.mismatches.care.less,
    );
  }
  return caveats;
}

function wantsMoreThanOffered<T extends string>(
  tolerated: T[],
  offered: T,
  scale: readonly T[],
): boolean {
  const lowestTolerated = Math.min(...tolerated.map((value) => scale.indexOf(value)));
  return lowestTolerated > scale.indexOf(offered);
}
