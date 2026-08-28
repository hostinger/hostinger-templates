import { GUESTS } from '../content/guests';
import { TABLES } from '../content/tables';
import type { Assignments, Guest } from '../types';
import { readAssignmentsFromUrl, seatKey, writeAssignmentsToUrl } from './urlState';

/**
 * The single source of truth for who sits where, plus the currently selected
 * guest for the tap-to-assign flow. Every mutation re-syncs the URL.
 */
class PlanStore {
  assignments = $state<Assignments>({});
  selectedGuestId = $state<string | null>(null);

  constructor() {
    this.assignments = readAssignmentsFromUrl();
  }

  guestAt(tableId: string, seatIndex: number): Guest | null {
    const guestId = this.assignments[seatKey(tableId, seatIndex)];
    if (!guestId) return null;
    return GUESTS.find((guest) => guest.id === guestId) ?? null;
  }

  get unassignedGuests(): Guest[] {
    const seated = new Set(Object.values(this.assignments));
    return GUESTS.filter((guest) => !seated.has(guest.id));
  }

  get seatedCount(): number {
    return Object.keys(this.assignments).length;
  }

  get totalGuests(): number {
    return GUESTS.length;
  }

  freeSeats(tableId: string): number {
    const table = TABLES.find((candidate) => candidate.id === tableId);
    if (!table) return 0;
    let taken = 0;
    for (let seat = 0; seat < table.seatCount; seat += 1) {
      if (this.assignments[seatKey(tableId, seat)]) taken += 1;
    }
    return table.seatCount - taken;
  }

  /**
   * Seats a guest, freeing any seat they previously held. If the target seat
   * is occupied, its previous occupant returns to the unassigned list.
   */
  assign(guestId: string, tableId: string, seatIndex: number): void {
    const target = seatKey(tableId, seatIndex);
    const next: Assignments = {};
    for (const [key, id] of Object.entries(this.assignments)) {
      if (id !== guestId && key !== target) next[key] = id;
    }
    next[target] = guestId;
    this.assignments = next;
    this.selectedGuestId = null;
    writeAssignmentsToUrl(this.assignments);
  }

  unassign(guestId: string): void {
    const next: Assignments = {};
    for (const [key, id] of Object.entries(this.assignments)) {
      if (id !== guestId) next[key] = id;
    }
    this.assignments = next;
    if (this.selectedGuestId === guestId) this.selectedGuestId = null;
    writeAssignmentsToUrl(this.assignments);
  }

  toggleSelect(guestId: string): void {
    this.selectedGuestId = this.selectedGuestId === guestId ? null : guestId;
  }

  clear(): void {
    this.assignments = {};
    this.selectedGuestId = null;
    writeAssignmentsToUrl(this.assignments);
  }
}

export const plan = new PlanStore();
