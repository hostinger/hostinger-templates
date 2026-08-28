/** Shapes for the committed content files in `src/data/`. */

export interface Faq {
  question: string;
  answer: string;
}

export interface ClubSecretary {
  name: string;
  role: string;
  email: string;
}

export interface Club {
  name: string;
  shortName: string;
  founded: number;
  league: string;
  division: string;
  crest: string;
  ground: string;
  groundAddress: string;
  colorsNote: string;
  trainingNote: string;
  kickoffNote: string;
  about: string;
  noticeboardNote: string;
  secretary: ClubSecretary;
  faqs: Faq[];
}

/** One row of the league table, exactly as the secretary keeps it. */
export interface TeamStanding {
  name: string;
  crest: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export type HomeAway = 'home' | 'away';

/** A final score from the club's point of view. */
export interface FixtureResult {
  goalsFor: number;
  goalsAgainst: number;
}

/** One club fixture; `result` stays null until the secretary records the score. */
export interface Fixture {
  matchday: number;
  opponent: string;
  homeAway: HomeAway;
  kickoff: Date;
  venue: string;
  result: FixtureResult | null;
}

export interface Season {
  label: string;
  updated: string;
  teams: TeamStanding[];
  fixtures: Fixture[];
}
