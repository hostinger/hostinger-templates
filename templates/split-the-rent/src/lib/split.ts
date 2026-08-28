import type { RoomInput, RoomShare, Scenario, SplitResult } from '../types';
import { ENSUITE_MULTIPLIER, WINDOW_MULTIPLIERS } from '../constants/weights';

/**
 * Parse a scenario's string fields into numbers. Returns null when the
 * scenario is not yet computable (rent or any room size missing/invalid),
 * which the UI treats as an empty state rather than an error.
 */
export function parseScenario(
  scenario: Scenario,
): { rent: number; rooms: RoomInput[] } | null {
  const rent = Number.parseFloat(scenario.rent);
  if (!Number.isFinite(rent) || rent <= 0) return null;

  const rooms: RoomInput[] = [];
  for (const room of scenario.rooms) {
    const sizeM2 = Number.parseFloat(room.size);
    if (!Number.isFinite(sizeM2) || sizeM2 <= 0) return null;
    rooms.push({
      id: room.id,
      name: room.name,
      sizeM2,
      window: room.window,
      ensuite: room.ensuite,
    });
  }
  return { rent, rooms };
}

/**
 * Split the rent across rooms.
 *
 * Each room's weight is size × window multiplier × en-suite multiplier.
 * Exact shares are rent × weight / totalWeight, then rounded to whole pence
 * with the largest-remainder method: floor everything, then give the
 * leftover pennies to the rooms with the largest fractional remainders.
 * The final amounts therefore always sum to the rent exactly.
 */
export function splitRent(rent: number, rooms: RoomInput[]): SplitResult {
  const rentPence = Math.round(rent * 100);
  const totalSizeM2 = rooms.reduce((sum, room) => sum + room.sizeM2, 0);

  const weighted = rooms.map((room) => {
    const windowMultiplier = WINDOW_MULTIPLIERS[room.window];
    const ensuiteMultiplier = room.ensuite ? ENSUITE_MULTIPLIER : 1;
    const weight = room.sizeM2 * windowMultiplier * ensuiteMultiplier;
    return { room, windowMultiplier, ensuiteMultiplier, weight };
  });
  const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0);

  const exactAmounts = weighted.map(
    (entry) => (rentPence * entry.weight) / totalWeight,
  );
  const finalAmounts = roundWithLargestRemainder(exactAmounts, rentPence);

  const shares: RoomShare[] = weighted.map((entry, index) => {
    const sizeShare = entry.room.sizeM2 / totalSizeM2;
    return {
      roomId: entry.room.id,
      name: entry.room.name,
      sizeM2: entry.room.sizeM2,
      window: entry.room.window,
      ensuite: entry.room.ensuite,
      sizeShare,
      baseAmountPence: rentPence * sizeShare,
      windowMultiplier: entry.windowMultiplier,
      ensuiteMultiplier: entry.ensuiteMultiplier,
      weight: entry.weight,
      weightShare: entry.weight / totalWeight,
      exactAmountPence: exactAmounts[index],
      finalAmountPence: finalAmounts[index],
      roundingPence: finalAmounts[index] - exactAmounts[index],
    };
  });

  return {
    rentPence,
    totalSizeM2,
    totalWeight,
    shares,
    totalPence: finalAmounts.reduce((sum, amount) => sum + amount, 0),
  };
}

/**
 * Largest-remainder rounding: floor each amount, then distribute the
 * remaining pence (targetPence − sum of floors) one at a time to the
 * amounts with the largest fractional parts.
 */
function roundWithLargestRemainder(
  exactPence: number[],
  targetPence: number,
): number[] {
  const floors = exactPence.map((amount) => Math.floor(amount));
  let leftover = targetPence - floors.reduce((sum, amount) => sum + amount, 0);

  const byRemainder = exactPence
    .map((amount, index) => ({ index, remainder: amount - Math.floor(amount) }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  const result = [...floors];
  for (const { index } of byRemainder) {
    if (leftover <= 0) break;
    result[index] += 1;
    leftover -= 1;
  }
  return result;
}

/** Convenience: parse a scenario and split it, or null if not computable. */
export function splitScenario(scenario: Scenario): SplitResult | null {
  const parsed = parseScenario(scenario);
  if (!parsed) return null;
  return splitRent(parsed.rent, parsed.rooms);
}