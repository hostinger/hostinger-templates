export interface ChartPoint {
  x: number;
  y: number;
}

export interface NiceScale {
  max: number;
  ticks: number[];
}

/**
 * A clean axis scale: picks a step from {1, 2, 2.5, 5} × 10^n so ticks land
 * on round numbers, then extends the domain to the last tick.
 */
export function niceScale(maxValue: number, tickCount = 4): NiceScale {
  const rough = maxValue / tickCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const residual = rough / magnitude;
  let factor = 10;
  if (residual <= 1) factor = 1;
  else if (residual <= 2) factor = 2;
  else if (residual <= 2.5) factor = 2.5;
  else if (residual <= 5) factor = 5;
  const step = factor * magnitude;
  const max = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];
  for (let tick = 0; tick <= max + step / 2; tick += step) ticks.push(tick);
  return { max, ticks };
}

export function linePath(points: ChartPoint[]): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${round(point.x)},${round(point.y)}`)
    .join(" ");
}

export function areaPath(points: ChartPoint[], baselineY: number): string {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${linePath(points)} L${round(last.x)},${round(baselineY)} L${round(first.x)},${round(baselineY)} Z`;
}

/** A column with a 4px-rounded data end and a square baseline. */
export function roundedColumnPath(x: number, y: number, width: number, height: number, radius = 4): string {
  const r = Math.min(radius, width / 2, height);
  const right = x + width;
  const bottom = y + height;
  return [
    `M${round(x)},${round(bottom)}`,
    `L${round(x)},${round(y + r)}`,
    `Q${round(x)},${round(y)} ${round(x + r)},${round(y)}`,
    `L${round(right - r)},${round(y)}`,
    `Q${round(right)},${round(y)} ${round(right)},${round(y + r)}`,
    `L${round(right)},${round(bottom)}`,
    "Z",
  ].join(" ");
}

/**
 * Evenly spread axis-label indexes (first and last always included), capped
 * so labels never collide: roughly one label per `labelSpace` pixels, at
 * most five.
 */
export function spreadIndexes(count: number, innerWidth: number, labelSpace = 52): number[] {
  const fit = Math.floor(innerWidth / labelSpace);
  const labels = Math.max(2, Math.min(5, fit, count));
  const indexes = Array.from({ length: labels }, (_, i) => Math.round((i * (count - 1)) / (labels - 1)));
  return [...new Set(indexes)];
}

/** Normalized sparkline points for a small trend line. */
export function sparkPoints(values: number[], width: number, height: number, pad = 3): ChartPoint[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values.map((value, index) => ({
    x: pad + (index / (values.length - 1)) * (width - pad * 2),
    y: pad + (1 - (value - min) / span) * (height - pad * 2),
  }));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
