import type { Scenario } from '../types';

/**
 * The demo scenario shown on first load (and whenever the URL contains
 * invalid parameters). Edit freely — it is just a starting point.
 */
export const SEED_SCENARIO: Scenario = {
  rent: '1800',
  rooms: [
    { id: 'seed-loft', name: 'The Loft', size: '14.5', window: 'bright', ensuite: true },
    { id: 'seed-garden', name: 'Garden Room', size: '11', window: 'small', ensuite: false },
    { id: 'seed-box', name: 'The Box Room', size: '8', window: 'none', ensuite: false },
  ],
};

/** Defaults applied when a flatmate adds a brand-new room. */
export const NEW_ROOM_DEFAULTS = {
  size: '10',
  window: 'small',
  ensuite: false,
} as const;
