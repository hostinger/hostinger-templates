import type { SeatPosition, TableShape } from '../types';

/**
 * Returns the seat centres for a table, as percentages of its canvas.
 * Round tables spread seats evenly around a circle starting at 12 o'clock.
 * Rectangular tables fill the long sides and, from six seats up, place one
 * seat on each short end.
 */
export function seatPositions(shape: TableShape, count: number): SeatPosition[] {
  return shape === 'round' ? roundPositions(count) : rectPositions(count);
}

function roundPositions(count: number): SeatPosition[] {
  const radius = 40;
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });
}

function rectPositions(count: number): SeatPosition[] {
  const endSeats = count >= 6 ? 2 : 0;
  const topCount = Math.ceil((count - endSeats) / 2);
  const bottomCount = count - endSeats - topCount;
  const positions: SeatPosition[] = [];

  // Spread n seats across the table's width, staying above the short ends.
  const spread = (n: number, index: number) => 50 + ((index + 1) / (n + 1) - 0.5) * 60;

  for (let i = 0; i < topCount; i += 1) {
    positions.push({ x: spread(topCount, i), y: 15 });
  }
  if (endSeats > 0) {
    positions.push({ x: 90, y: 50 });
  }
  for (let i = bottomCount - 1; i >= 0; i -= 1) {
    positions.push({ x: spread(bottomCount, i), y: 85 });
  }
  if (endSeats > 0) {
    positions.push({ x: 10, y: 50 });
  }
  return positions;
}
