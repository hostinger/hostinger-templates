import type { TeamStanding } from '../models/content';

/** Goal difference for a table row, derived so it can never disagree with the goals columns. */
export const goalDifference = (team: TeamStanding): number => team.goalsFor - team.goalsAgainst;

/** Formats a goal difference with an explicit sign: "+7", "0", "-5". */
export const formatSigned = (value: number): string => (value > 0 ? `+${value}` : String(value));
