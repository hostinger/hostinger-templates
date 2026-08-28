import type { Room, Scenario, WindowQuality } from '../types';
import { MAX_ROOMS, MIN_ROOMS, WINDOW_QUALITIES } from '../constants/weights';

/**
 * The whole scenario is encoded into the URL query string:
 *
 *   ?rent=1800&r=The%20Loft|14.5|bright|1&r=Garden%20Room|11|small|0
 *
 * One `r` parameter per room, fields separated by `|` (names are
 * percent-encoded so they can safely contain `|`). Invalid or missing
 * parameters make the decoder return null and the app falls back to the seed.
 */

const RENT_PARAM = 'rent';
const ROOM_PARAM = 'r';

export function encodeScenario(scenario: Scenario): string {
  const params = new URLSearchParams();
  params.set(RENT_PARAM, scenario.rent);
  for (const room of scenario.rooms) {
    params.append(
      ROOM_PARAM,
      [
        encodeURIComponent(room.name),
        room.size,
        room.window,
        room.ensuite ? '1' : '0',
      ].join('|'),
    );
  }
  return params.toString();
}

export function decodeScenario(search: string): Scenario | null {
  const params = new URLSearchParams(search);

  const rent = params.get(RENT_PARAM);
  if (rent === null || !isParseablePositiveNumber(rent)) return null;

  const roomParams = params.getAll(ROOM_PARAM);
  if (roomParams.length < MIN_ROOMS || roomParams.length > MAX_ROOMS) return null;

  const rooms: Room[] = [];
  for (const [index, encoded] of roomParams.entries()) {
    const parts = encoded.split('|');
    if (parts.length !== 4) return null;
    const [encodedName, size, window, ensuite] = parts;
    if (!isParseablePositiveNumber(size)) return null;
    if (!isWindowQuality(window)) return null;
    if (ensuite !== '0' && ensuite !== '1') return null;

    let name: string;
    try {
      name = decodeURIComponent(encodedName);
    } catch {
      return null;
    }
    if (name.trim() === '') return null;

    rooms.push({
      id: `url-${index}`,
      name,
      size,
      window,
      ensuite: ensuite === '1',
    });
  }

  return { rent, rooms };
}

/** Replace the current URL's query string without adding a history entry. */
export function syncUrl(scenario: Scenario): void {
  const query = encodeScenario(scenario);
  window.history.replaceState(null, '', `${window.location.pathname}?${query}`);
}

function isParseablePositiveNumber(value: string): boolean {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0;
}

function isWindowQuality(value: string): value is WindowQuality {
  return (WINDOW_QUALITIES as string[]).includes(value);
}
