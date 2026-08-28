import clubJson from '../data/club.json';
import seasonJson from '../data/season.json';
import type { Club, Fixture, Season } from './models/content';

type RawFixture = (typeof seasonJson)['fixtures'][number];

/**
 * Kick-off strings in the season file carry no timezone on purpose: they are
 * parsed as local ground time, which is how a club reads its own fixtures.
 */
const toFixture = (raw: RawFixture): Fixture => ({
  matchday: raw.matchday,
  opponent: raw.opponent,
  homeAway: raw.homeAway === 'home' ? 'home' : 'away',
  kickoff: new Date(raw.kickoff),
  venue: raw.venue,
  result: raw.result,
});

/** Club identity, copy, contact details, and FAQs — edit `src/data/club.json`. */
export const CLUB: Club = clubJson;

/** Table and fixtures for the current season — edit `src/data/season.json`. */
export const SEASON: Season = {
  label: seasonJson.label,
  updated: seasonJson.updated,
  teams: seasonJson.teams,
  fixtures: seasonJson.fixtures.map(toFixture),
};
