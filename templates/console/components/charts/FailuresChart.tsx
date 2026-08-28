"use client";

import { useRef, useState } from "react";
import { niceScale, roundedColumnPath, spreadIndexes } from "@/lib/chart";
import { formatCompact, formatDateShort, formatInt, formatPercent } from "@/lib/format";
import type { DayPoint } from "@/lib/types";
import styles from "./charts.module.css";
import { useMeasuredWidth } from "./useMeasuredWidth";

const HEIGHT = 248;
const MARGIN = { top: 18, right: 14, bottom: 28, left: 44 };
const TOOLTIP_WIDTH = 176;

function shareOfAttempts(day: DayPoint): string {
  return formatPercent((day.failed / (day.delivered + day.failed)) * 100, 2);
}

export function FailuresChart({ days, windowLabel }: { days: DayPoint[]; windowLabel: string }) {
  const { ref, width } = useMeasuredWidth<HTMLDivElement>(430);
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 80);
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const values = days.map((day) => day.failed);
  const { max, ticks } = niceScale(Math.max(...values));
  const maxIndex = values.indexOf(Math.max(...values));

  const slot = innerWidth / days.length;
  const barWidth = Math.min(22, Math.max(6, slot - 6));
  const xCenter = (index: number) => MARGIN.left + slot * index + slot / 2;
  const y = (value: number) => MARGIN.top + (1 - value / max) * innerHeight;
  const baselineY = y(0);
  const xTickIndexes = spreadIndexes(days.length, innerWidth);

  const total = values.reduce((sum, value) => sum + value, 0);
  const summary =
    `Bar chart of failed deliveries per day, ${windowLabel}. ` +
    `Total ${formatInt(total)}; the largest spike is ${formatInt(values[maxIndex])} on ${formatDateShort(days[maxIndex].date)}. ` +
    "Use the left and right arrow keys to inspect each day.";

  function indexFromClientX(clientX: number): number | null {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const position = (clientX - rect.left - MARGIN.left) / slot;
    return Math.min(days.length - 1, Math.max(0, Math.floor(position)));
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const move = (next: (current: number) => number) => {
      event.preventDefault();
      setActive((current) => next(current ?? maxIndex));
    };
    if (event.key === "ArrowRight") move((current) => Math.min(days.length - 1, current + 1));
    if (event.key === "ArrowLeft") move((current) => Math.max(0, current - 1));
    if (event.key === "Home") move(() => 0);
    if (event.key === "End") move(() => days.length - 1);
    if (event.key === "Escape") setActive(null);
  }

  const tooltipLeft =
    active === null
      ? 0
      : xCenter(active) + TOOLTIP_WIDTH + 24 > width
        ? xCenter(active) - TOOLTIP_WIDTH - 12
        : xCenter(active) + 12;

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
            {days.map((day, index) => (
              <path
                key={day.date}
                className={active === index ? `${styles.bar} ${styles.barActive}` : styles.bar}
                d={roundedColumnPath(xCenter(index) - barWidth / 2, y(day.failed), barWidth, baselineY - y(day.failed))}
              />
            ))}
            <line className={styles.axisLine} x1={MARGIN.left} x2={MARGIN.left + innerWidth} y1={baselineY} y2={baselineY} />
            {xTickIndexes.map((index) => (
              <text key={index} className={styles.tickLabel} x={xCenter(index)} y={HEIGHT - 8} textAnchor="middle">
                {formatDateShort(days[index].date)}
              </text>
            ))}
            <text className={styles.peakLabel} x={xCenter(maxIndex)} y={y(values[maxIndex]) - 7} textAnchor="middle">
              {formatInt(values[maxIndex])}
            </text>
          </svg>
          {active !== null ? (
            <div className={styles.tooltip} style={{ left: tooltipLeft, top: 10, width: TOOLTIP_WIDTH }}>
              <p className={styles.tooltipDate}>{formatDateShort(days[active].date)}</p>
              <p className={styles.tooltipRow}>
                <span className={`${styles.tooltipKey} ${styles.tooltipKeyCritical}`} aria-hidden />
                <span className={styles.tooltipValue}>{formatInt(days[active].failed)}</span>
                <span className={styles.tooltipLabel}>failed</span>
              </p>
              <p className={styles.tooltipRow}>
                <span className={styles.tooltipKeySpacer} aria-hidden />
                <span className={styles.tooltipValue}>{shareOfAttempts(days[active])}</span>
                <span className={styles.tooltipLabel}>of attempts</span>
              </p>
            </div>
          ) : null}
          <p className="sr-only" aria-live="polite">
            {active !== null
              ? `${formatDateShort(days[active].date)}: ${formatInt(days[active].failed)} failed, ${shareOfAttempts(days[active])} of attempts`
              : ""}
          </p>
        </div>
      </div>
      <details className={styles.tableToggle}>
        <summary className={styles.tableSummary}>View as table</summary>
        <table className={styles.dataTable}>
          <caption className="sr-only">Failed deliveries per day, {windowLabel}</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Failed</th>
              <th scope="col">Share of attempts</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date}>
                <th scope="row">{formatDateShort(day.date)}</th>
                <td>{formatInt(day.failed)}</td>
                <td>{shareOfAttempts(day)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
