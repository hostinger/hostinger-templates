export type TableShape = 'round' | 'rect';

export interface Guest {
  id: string;
  name: string;
}

export interface TableSpec {
  id: string;
  name: string;
  seatCount: number;
  shape: TableShape;
}

/** Maps a seat key (`tableId:seatIndex`) to the guest id sitting there. */
export type Assignments = Record<string, string>;

/** Seat centre expressed as percentages of the table canvas. */
export interface SeatPosition {
  x: number;
  y: number;
}

export interface HowToEntry {
  question: string;
  answer: string;
}
