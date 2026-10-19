import type { ProfilePoint } from '../types/content.js';
import { formatKm, formatMetres } from './format.js';

export interface AxisTick {
  pos: number;
  label: string;
}

export interface ChartPoint {
  x: number;
  y: number;
  km: number;
  m: number;
}

export interface ProfileChart {
  width: number;
  height: number;
  plot: { left: number; right: number; top: number; bottom: number };
  areaPath: string;
  linePath: string;
  xTicks: AxisTick[];
  yTicks: AxisTick[];
  peak: ChartPoint;
  peakLabel: string;
  peakLabelX: number;
  points: ChartPoint[];
  ariaLabel: string;
}

export interface SparklineChart {
  width: number;
  height: number;
  areaPath: string;
  linePath: string;
}

const CHART_WIDTH = 760;
const CHART_HEIGHT = 300;
const CHART_PADDING = { left: 56, right: 22, top: 34, bottom: 40 };

const SPARK_WIDTH = 320;
const SPARK_HEIGHT = 64;
const SPARK_PADDING = 3;

/**
 * Minimum elevation span (m) a chart is drawn against, so a nearly flat
 * route is not stretched into looking mountainous.
 */
const MIN_ELEVATION_SPAN = 160;

const X_TICK_STEPS = [1, 2, 5, 10];
const Y_TICK_STEPS = [25, 50, 100, 200, 250, 500];
const MAX_X_TICKS = 8;
const MAX_Y_TICKS = 5;

const round1 = (value: number): number => Math.round(value * 10) / 10;

function pickStep(range: number, steps: number[], maxTicks: number): number {
  for (const step of steps) {
    if (range / step <= maxTicks) {
      return step;
    }
  }
  return steps[steps.length - 1] ?? 1;
}

interface ElevationDomain {
  low: number;
  high: number;
  step: number;
}

function elevationDomain(profile: ProfilePoint[]): ElevationDomain {
  const elevations = profile.map((point) => point.m);
  const min = Math.min(...elevations);
  const max = Math.max(...elevations);
  const span = Math.max(max - min, MIN_ELEVATION_SPAN);
  const step = pickStep(span, Y_TICK_STEPS, MAX_Y_TICKS);

  const paddedLow = Math.max(0, min - (span - (max - min)) / 2);
  const low = Math.floor(paddedLow / step) * step;
  const high = Math.ceil(Math.max(paddedLow + span, max) / step) * step;
  return { low, high, step };
}

function buildPaths(points: ChartPoint[], baselineY: number): {
  linePath: string;
  areaPath: string;
} {
  const segments = points.map(
    (point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`,
  );
  const linePath = segments.join(' ');
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) {
    return { linePath: '', areaPath: '' };
  }
  const areaPath = `${linePath} L${last.x} ${baselineY} L${first.x} ${baselineY} Z`;
  return { linePath, areaPath };
}

/** Builds the geometry for the full elevation profile chart on route pages. */
export function buildProfileChart(profile: ProfilePoint[]): ProfileChart {
  if (profile.length < 2) {
    throw new Error('An elevation profile needs at least two points.');
  }

  const plot = {
    left: CHART_PADDING.left,
    right: CHART_WIDTH - CHART_PADDING.right,
    top: CHART_PADDING.top,
    bottom: CHART_HEIGHT - CHART_PADDING.bottom,
  };
  const plotWidth = plot.right - plot.left;
  const plotHeight = plot.bottom - plot.top;

  const lastPoint = profile[profile.length - 1];
  const maxKm = lastPoint ? lastPoint.km : 0;
  const { low, high, step } = elevationDomain(profile);

  const toX = (km: number): number => round1(plot.left + (km / maxKm) * plotWidth);
  const toY = (m: number): number =>
    round1(plot.bottom - ((m - low) / (high - low)) * plotHeight);

  const points: ChartPoint[] = profile.map((point) => ({
    x: toX(point.km),
    y: toY(point.m),
    km: point.km,
    m: point.m,
  }));

  const { linePath, areaPath } = buildPaths(points, plot.bottom);

  const xStep = pickStep(maxKm, X_TICK_STEPS, MAX_X_TICKS);
  const xTicks: AxisTick[] = [];
  for (let km = 0; km <= maxKm; km += xStep) {
    const isLast = km + xStep > maxKm;
    xTicks.push({ pos: toX(km), label: isLast ? `${km} km` : `${km}` });
  }

  const yTicks: AxisTick[] = [];
  for (let m = low; m <= high; m += step) {
    yTicks.push({ pos: toY(m), label: m === low ? `${m} m` : `${m}` });
  }

  let peak = points[0] as ChartPoint;
  for (const point of points) {
    if (point.m > peak.m) {
      peak = point;
    }
  }
  const peakLabelX = Math.min(Math.max(peak.x, plot.left + 34), plot.right - 34);

  const minElevation = Math.min(...profile.map((point) => point.m));
  const maxElevation = Math.max(...profile.map((point) => point.m));
  const ariaLabel =
    `Elevation profile over ${formatKm(maxKm)}: ` +
    `from ${formatMetres(minElevation)} to ${formatMetres(maxElevation)} above sea level. ` +
    'Full figures in the profile data table below.';

  return {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    plot,
    areaPath,
    linePath,
    xTicks,
    yTicks,
    peak,
    peakLabel: formatMetres(peak.m),
    peakLabelX: round1(peakLabelX),
    points,
    ariaLabel,
  };
}

/** Builds the small decorative profile drawn on every route card. */
export function buildSparkline(profile: ProfilePoint[]): SparklineChart {
  if (profile.length < 2) {
    throw new Error('An elevation profile needs at least two points.');
  }

  const lastPoint = profile[profile.length - 1];
  const maxKm = lastPoint ? lastPoint.km : 0;
  const { low, high } = elevationDomain(profile);

  const plotWidth = SPARK_WIDTH - SPARK_PADDING * 2;
  const plotHeight = SPARK_HEIGHT - SPARK_PADDING * 2;
  const baselineY = SPARK_HEIGHT - SPARK_PADDING;

  const points: ChartPoint[] = profile.map((point) => ({
    x: round1(SPARK_PADDING + (point.km / maxKm) * plotWidth),
    y: round1(baselineY - ((point.m - low) / (high - low)) * plotHeight),
    km: point.km,
    m: point.m,
  }));

  const { linePath, areaPath } = buildPaths(points, baselineY);

  return {
    width: SPARK_WIDTH,
    height: SPARK_HEIGHT,
    areaPath,
    linePath,
  };
}
