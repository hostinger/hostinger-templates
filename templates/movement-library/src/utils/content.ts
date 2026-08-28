import exercisesData from '../data/exercises.json';
import siteData from '../data/site.json';
import {
  BODY_PARTS,
  type BodyPart,
  type Exercise,
  type SiteContent,
} from '../types/content';

export const site = siteData as SiteContent;

export const exercises = exercisesData as Exercise[];

export const exercisesById: ReadonlyMap<string, Exercise> = new Map(
  exercises.map((exercise) => [exercise.id, exercise]),
);

export const exerciseIds: ReadonlySet<string> = new Set(
  exercises.map((exercise) => exercise.id),
);

export const countExercisesForPart = (part: BodyPart): number =>
  exercises.filter((exercise) => exercise.bodyParts.includes(part)).length;

export const libraryBodyParts: readonly BodyPart[] = BODY_PARTS.filter(
  (part) => countExercisesForPart(part) > 0,
);

export const formatBodyPart = (part: BodyPart): string =>
  part.charAt(0).toUpperCase() + part.slice(1);
