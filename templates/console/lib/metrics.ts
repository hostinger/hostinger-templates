import { metricsMock, timeseries } from "./data";
import { formatInt, formatPercent, formatSigned } from "./format";
import type { DayPoint, StatCardData, StatDelta } from "./types";

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length / 2;
  if (sorted.length % 2 === 1) return sorted[Math.floor(middle)];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function successRate(days: DayPoint[]): number {
  const delivered = sum(days.map((day) => day.delivered));
  const failed = sum(days.map((day) => day.failed));
  return (delivered / (delivered + failed)) * 100;
}

function delta(current: number, previous: number, text: string, upIsGood: boolean): StatDelta {
  const direction = current >= previous ? "up" : "down";
  const good = direction === "up" ? upIsGood : !upIsGood;
  return {
    text,
    direction,
    good,
    srText: `${direction === "up" ? "Up" : "Down"} ${text.replace(/^[+−]/, "")} ${metricsMock.comparisonLabel}`,
  };
}

/**
 * Every headline value is derived from mocks/timeseries.json (or, for
 * endpoint counts, mocks/metrics.json) at build time, so the stat cards
 * always agree with the charts drawn from the same series.
 */
export function buildStatCards(): StatCardData[] {
  const current = timeseries.current.days;
  const previous = timeseries.previous.days;
  const { cards, comparisonLabel } = metricsMock;

  const deliveredCurrent = sum(current.map((day) => day.delivered));
  const deliveredPrevious = sum(previous.map((day) => day.delivered));
  const deliveredChange = ((deliveredCurrent - deliveredPrevious) / deliveredPrevious) * 100;

  const rateCurrent = successRate(current);
  const ratePrevious = successRate(previous);

  const latencyCurrent = median(current.map((day) => day.p50Ms));
  const latencyPrevious = median(previous.map((day) => day.p50Ms));

  const endpointsCurrent = cards.endpoints.current ?? 0;
  const endpointsPrevious = cards.endpoints.previous ?? 0;

  return [
    {
      id: "delivered",
      label: cards.delivered.label,
      hint: cards.delivered.hint,
      value: formatInt(deliveredCurrent),
      delta: delta(deliveredCurrent, deliveredPrevious, formatSigned(deliveredChange, 1, "%"), true),
      comparison: comparisonLabel,
      spark: current.map((day) => day.delivered),
    },
    {
      id: "successRate",
      label: cards.successRate.label,
      hint: cards.successRate.hint,
      value: formatPercent(rateCurrent, 2),
      delta: delta(rateCurrent, ratePrevious, formatSigned(rateCurrent - ratePrevious, 2, " pp"), true),
      comparison: comparisonLabel,
      spark: current.map((day) => successRateOfDay(day)),
    },
    {
      id: "latency",
      label: cards.latency.label,
      hint: cards.latency.hint,
      value: formatInt(latencyCurrent),
      unit: "ms",
      delta: delta(latencyCurrent, latencyPrevious, formatSigned(latencyCurrent - latencyPrevious, 0, " ms"), false),
      comparison: comparisonLabel,
      spark: current.map((day) => day.p50Ms),
    },
    {
      id: "endpoints",
      label: cards.endpoints.label,
      hint: cards.endpoints.hint,
      value: formatInt(endpointsCurrent),
      delta: delta(endpointsCurrent, endpointsPrevious, formatSigned(endpointsCurrent - endpointsPrevious, 0, ""), true),
      comparison: comparisonLabel,
      spark: null,
    },
  ];
}

function successRateOfDay(day: DayPoint): number {
  return (day.delivered / (day.delivered + day.failed)) * 100;
}
