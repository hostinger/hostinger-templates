/** Window quality of a room, from worst to best. */
export type WindowQuality = 'none' | 'small' | 'bright';

/**
 * One room as edited in the form. Numeric fields are kept as strings so
 * in-progress typing ("14.", "") never fights the inputs; parsing happens
 * in the split module.
 */
export interface Room {
  id: string;
  name: string;
  /** Floor area in m², as typed. */
  size: string;
  window: WindowQuality;
  ensuite: boolean;
}

/** The whole shareable scenario: total rent plus every room. */
export interface Scenario {
  /** Total monthly rent, as typed. */
  rent: string;
  rooms: Room[];
}

/** A parsed, validated room ready for the split calculation. */
export interface RoomInput {
  id: string;
  name: string;
  sizeM2: number;
  window: WindowQuality;
  ensuite: boolean;
}

/** Full per-room working-out, one entry per room. */
export interface RoomShare {
  roomId: string;
  name: string;
  sizeM2: number;
  window: WindowQuality;
  ensuite: boolean;
  /** Fraction of total floor area, 0–1. */
  sizeShare: number;
  /** Rent × sizeShare before any adjustments, in pence. */
  baseAmountPence: number;
  windowMultiplier: number;
  ensuiteMultiplier: number;
  /** sizeM2 × windowMultiplier × ensuiteMultiplier. */
  weight: number;
  /** Fraction of total weight, 0–1. */
  weightShare: number;
  /** Rent × weightShare before rounding, in fractional pence. */
  exactAmountPence: number;
  /** Final integer pence after largest-remainder rounding. */
  finalAmountPence: number;
  /** finalAmountPence − exactAmountPence, in fractional pence. */
  roundingPence: number;
}

/** Result of splitting the rent across all rooms. */
export interface SplitResult {
  rentPence: number;
  totalSizeM2: number;
  totalWeight: number;
  shares: RoomShare[];
  /** Always equals rentPence — the largest-remainder step guarantees it. */
  totalPence: number;
}
