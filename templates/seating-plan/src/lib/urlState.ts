import { GUESTS } from '../content/guests';
import { TABLES } from '../content/tables';
import type { Assignments } from '../types';

const PARAM = 'p';
const TABLE_SEPARATOR = '~';
const SEAT_SEPARATOR = '.';

export function seatKey(tableId: string, seatIndex: number): string {
  return `${tableId}:${seatIndex}`;
}

/**
 * Encodes assignments as one compact string: tables joined by `~`, each
 * table's seats joined by `.`, each seat holding a 1-based guest index or
 * nothing. Example for 6 + 8 seats: `1..4.9..~..2......`
 */
export function encodeAssignments(assignments: Assignments): string {
  return TABLES.map((table) =>
    Array.from({ length: table.seatCount }, (_, seat) => {
      const guestId = assignments[seatKey(table.id, seat)];
      const guestIndex = guestId ? GUESTS.findIndex((guest) => guest.id === guestId) : -1;
      return guestIndex >= 0 ? String(guestIndex + 1) : '';
    }).join(SEAT_SEPARATOR),
  ).join(TABLE_SEPARATOR);
}

/** Decodes the compact string, dropping out-of-range or duplicate guests. */
export function decodeAssignments(encoded: string): Assignments {
  const assignments: Assignments = {};
  const seatedGuests = new Set<string>();
  const tableParts = encoded.split(TABLE_SEPARATOR);

  TABLES.forEach((table, tableIndex) => {
    const seatParts = (tableParts[tableIndex] ?? '').split(SEAT_SEPARATOR);
    for (let seat = 0; seat < table.seatCount; seat += 1) {
      const raw = seatParts[seat];
      if (!raw) continue;
      const guestIndex = Number.parseInt(raw, 10) - 1;
      const guest = Number.isInteger(guestIndex) ? GUESTS[guestIndex] : undefined;
      if (!guest || seatedGuests.has(guest.id)) continue;
      seatedGuests.add(guest.id);
      assignments[seatKey(table.id, seat)] = guest.id;
    }
  });

  return assignments;
}

export function readAssignmentsFromUrl(): Assignments {
  const encoded = new URLSearchParams(window.location.search).get(PARAM);
  return encoded ? decodeAssignments(encoded) : {};
}

function urlWithAssignments(assignments: Assignments): URL {
  const url = new URL(window.location.href);
  if (Object.keys(assignments).length === 0) {
    url.searchParams.delete(PARAM);
  } else {
    url.searchParams.set(PARAM, encodeAssignments(assignments));
  }
  return url;
}

export function writeAssignmentsToUrl(assignments: Assignments): void {
  window.history.replaceState(null, '', urlWithAssignments(assignments));
}

export function buildShareUrl(assignments: Assignments): string {
  return urlWithAssignments(assignments).toString();
}
