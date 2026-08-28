import type { TableSpec } from '../types';

/**
 * The tables on the floor plan. `shape` is either `round` or `rect`.
 * Round tables fit up to 12 seats comfortably; rectangular tables place two
 * seats on the short ends once they have six or more seats.
 *
 * Note: share links encode seats by table order and seat count, so links
 * created before an edit here may not restore the same arrangement.
 */
export const TABLES: TableSpec[] = [
  { id: 'table-one', name: 'Table One', seatCount: 6, shape: 'round' },
  { id: 'table-two', name: 'Table Two', seatCount: 8, shape: 'rect' },
];
