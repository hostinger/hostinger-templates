import type { WindowQuality } from '../types';

/**
 * Tune the fairness maths here.
 *
 * Each room's weight is: size in m² × window multiplier × en-suite multiplier.
 * A multiplier of 1 means "no adjustment"; 1.10 makes a room 10% more
 * expensive per m², 0.90 makes it 10% cheaper per m².
 */

/** How much window quality changes a room's price per m². */
export const WINDOW_MULTIPLIERS: Record<WindowQuality, number> = {
  none: 0.88,
  small: 1.0,
  bright: 1.1,
};

/** Applied on top when a room has its own bathroom. */
export const ENSUITE_MULTIPLIER = 1.18;

/** Human-readable labels for each window quality, shown in the form and receipt. */
export const WINDOW_LABELS: Record<WindowQuality, string> = {
  none: 'No window',
  small: 'Small window',
  bright: 'Big + bright',
};

/** Ordered list used to render the window quality picker. */
export const WINDOW_QUALITIES: WindowQuality[] = ['none', 'small', 'bright'];

/** Room count limits enforced by the add/remove controls and the URL decoder. */
export const MIN_ROOMS = 2;
export const MAX_ROOMS = 6;
