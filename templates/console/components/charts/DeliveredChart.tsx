"use client";

import { useRef, useState } from "react";
import { areaPath, linePath, niceScale, spreadIndexes } from "@/lib/chart";
import { formatCompact, formatDateShort, formatInt } from "@/lib/format";
import type { DayPoint } from "@/lib/types";
import styles from "./charts.module.css";
import { useMeasuredWidth } from "./useMeasuredWidth";

const HEIGHT = 248;
const MARGIN = { top: 18, right: 62, bottom: 28, left: 46 };
const TOOLTIP_WIDTH = 172;

export function DeliveredChart({ days, windowLabel }: { days: DayPoint[]; windowLabel: string }) {
  const { ref, width } = useMeasuredWidth<HTMLDivElement>(620);
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 80);
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const values = days.map((day) => day.delivered);
  const { max, ticks } = niceScale(Math.max(...values));

  const x = (index: number) => MARGIN.left + (index / (days.length - 1)) * innerWidth;
  const y = (value: number) => MARGIN.top + (1 - value / max) * innerHeight;
  const points = days.map((day, index) => ({ x: x(index), y: y(day.delivered) }));
  const baselineY = y(0);
  const endPoint = points[points.length - 1];
  const xTickIndexes = spreadIndexes(days.length, innerWidth);

  const total = values.reduce((sum, value) => sum + value, 0);
  const summary =
    `Area chart of successful deliveries per day, ${windowLabel}. ` +
    `Total ${formatInt(total)}; daily values run from ${formatInt(Math.min(...values))} to ${formatInt(Math.max(...values))}. ` +
    "Use the left and right arrow keys to inspect each day.";

  function indexFromClientX(clientX: number): number | null {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const ratio = (clientX - rect.left - MARGIN.left) / innerWidth;
    return Math.min(days.length - 1, Math.max(0, Math.round(ratio * (days.length - 1))));
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const move = (next: (current: number) => number) => {
      event.preventDefault();
      setActive((current) => next(current ?? days.length - 1));
    };
    if (event.key === "ArrowRight") move((current) => Math.min(days.length - 1, current + 1));
    if (event.key === "ArrowLeft") move((current) => Math.max(0, current - 1));
    if (event.key === "Home") move(() => 0);
    if (event.key === "End") move(() => days.length - 1);
    if (event.key === "Escape") setActive(null);
  }

  const tooltipLeft =
    active === null ? 0 : x(active) + TOOLTIP_WIDTH + 26 > width ? x(active) - TOOLTIP_WIDTH - 14 : x(active) + 14;

  return (
    <div className={styles.chartBlock}>
      <div ref={ref} className={styles.chartRoot}>
        <div
          className={styles.interactive}
          tabIndex={0}
          role="group"
          aria-roledescription="interactive chart"
          aria-label={summary}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
        >
          <svg
            ref={svgRef}
            className={styles.svg}
            width={width}
            height={HEIGHT}
            aria-hidden
            onPointerMove={(event) => setActive(indexFromClientX(event.clientX))}
            onPointerLeave={() => setActive(null)}
          >
            {ticks.map((tick) => (
              <g key={tick}>
                {tick > 0 ? (
                  <line
                    className={styles.gridline}
                    x1={MARGIN.left}
                    x2={MARGIN.left + innerWidth}
                    y1={y(tick)}
                    y2={y(tick)}
                  />
                ) : null}
                <text className={styles.tickLabel} x={MARGIN.left - 8} y={y(tick) + 3.5} textAnchor="end">
                  {formatCompact(tick)}
                </text>
              </g>
            ))}
            <line className={styles.axisLine} x1={MARGIN.left} x2={MARGIN.left + innerWidth} y1={baselineY} y2={baselineY} />
            <path className={styles.areaFill} d={areaPath(points, baselineY)} />
            <path className={styles.lineStroke} d={linePath(points)} />
            {xTickIndexes.map((index) => (
              <text key={index} className={styles.tickLabel} x={x(index)} y={HEIGHT - 8} textAnchor="middle">
                {formatDateShort(days[index].date)}
              </text>
            ))}
            {active !== null ? (
              <line className={styles.crosshair} x1={x(active)} x2={x(active)} y1={MARGIN.top} y2={baselineY} />
            ) : null}
            {active !== null && active !== days.length - 1 ? (
              <circle className={styles.pointDot} cx={points[active].x} cy={points[active].y} r={4.5} />
            ) : null}
            <circle className={styles.pointDot} cx={endPoint.x} cy={endPoint.y} r={4.5} />
            <text className={styles.endLabel} x={endPoint.x + 10} y={endPoint.y + 4}>
              {formatCompact(values[values.length - 1])}
            </text>
          </svg>
          {active !== null ? (
            <div className={styles.tooltip} style={{ left: tooltipLeft, top: 10, width: TOOLTIP_WIDTH }}>
              <p className={styles.tooltipDate}>{formatDateShort(days[active].date)}</p>
              <p className={styles.tooltipRow}>
                <span className={styles.tooltipKey} aria-hidden />
                <span className={styles.tooltipValue}>{formatInt(days[active].delivered)}</span>
                <span className={styles.tooltipLabel}>delivered</span>
              </p>
            </div>
          ) : null}
          <p className="sr-only" aria-live="polite">
            {active !== null ? `${formatDateShort(days[active].date)}: ${formatInt(days[active].delivered)} delivered` : ""}
          </p>
        </div>
      </div>
      <details className={styles.tableToggle}>
        <summary className={styles.tableSummary}>View as table</summary>
        <table className={styles.dataTable}>
          <caption className="sr-only">Successful deliveries per day, {windowLabel}</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Delivered</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date}>
                <th scope="row">{formatDateShort(day.date)}</th>
                <td>{formatInt(day.delivered)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
