/**
 * Deterministic waveform silhouettes. Each episode number seeds the same
 * pseudo-random generator, so an episode's waveform looks identical on the
 * player timeline, its card, and every rebuild.
 */

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns `count` bar heights in the 0.12–1 range, shaped like speech:
 * smooth swells with occasional emphatic peaks and short rests.
 */
export function getWaveformBars(seed: number, count: number): number[] {
  const random = mulberry32(seed * 2654435761 + 97);
  const bars: number[] = [];
  let swell = 0.55;

  for (let i = 0; i < count; i += 1) {
    swell += (random() - 0.5) * 0.34;
    swell = Math.min(0.92, Math.max(0.3, swell));

    const flutter = random() * 0.38;
    const rest = random() < 0.07 ? 0.35 : 1;
    const peak = random() < 0.06 ? 1.25 : 1;
    const height = (swell + flutter) * rest * peak;

    bars.push(Math.min(1, Math.max(0.12, Number(height.toFixed(3)))));
  }

  return bars;
}
